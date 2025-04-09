import { createRxDatabase, addRxPlugin, RxCollectionBase } from 'rxdb/plugins/core';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateAppwrite } from 'rxdb/plugins/replication-appwrite';
import { ID } from 'appwrite';
import { client, databases, appwriteConfig } from './appwrite.js';
import { writable } from 'svelte/store';
import { isAuthenticated } from './auth.js';

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// Journal entry schema
const journalSchema = {
    title: 'journal entry schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        title: {
            type: 'string'
        },
        content: {
            type: 'string'
        },        createdAt: {
            type: 'number'
        },
        updatedAt: {
            type: 'number'
        }
    },
    required: ['id', 'title', 'content', 'createdAt', 'updatedAt']
};

// Create database stores
let dbPromise = null;
export const dbStatus = writable('initializing');
export const syncStatus = writable('offline');

export const getDB = async () => {
    if (dbPromise) return dbPromise;

    dbStatus.set('creating');
    
    try {
        // Create the database
        dbPromise = createRxDatabase({
            name: 'journals',
            storage: getRxStorageDexie()
        });

        const db = await dbPromise;
        
        // Add collections
        await db.addCollections({
            entries: {
                schema: journalSchema
            }
        });

        dbStatus.set('ready');
        
        // Set up replication when user is authenticated
        setupReplication(db);
        
        return db;
    } catch (error) {
        console.error('Database creation error:', error);
        dbStatus.set('error');
        throw error;
    }
};

let replicationState = null;

// Set up replication with Appwrite
const setupReplication = async (db) => {
    try {
        // Only set online when authenticated through the auth module
        
        let authenticated = false;
        const unsubscribe = isAuthenticated.subscribe(value => {
            authenticated = value;
        });
        
        if (!authenticated) {
            syncStatus.set('offline');
            unsubscribe();
            return;
        }
        
        syncStatus.set('online');
        
        // Start replication
        replicationState = replicateAppwrite({
            replicationIdentifier: 'journals-replication',
            client,
            databaseId: appwriteConfig.databaseId,
            collectionId: appwriteConfig.collectionId,
            deletedField: 'deleted',
            collection: db.entries,
            pull: {
                batchSize: 10
            },
            push: {
                batchSize: 10
            }
        });

        // Handle replication events
        replicationState.error$.subscribe(error => {
            console.error('Replication error:', error);
            syncStatus.set('error');
        });

        replicationState.active$.subscribe(active => {
            syncStatus.set(active ? 'syncing' : 'online');
        });

        return replicationState;
    } catch (error) {
        console.error('Replication setup error:', error);
        syncStatus.set('error');
    }
};

// Manual sync function
export const triggerSync = async () => {
    if (!replicationState) {
        throw new Error('Replication not initialized');
    }
    
    try {
        syncStatus.set('syncing');
        await replicationState.reSync();
        syncStatus.set('online');
    } catch (error) {
        console.error('Manual sync error:', error);
        syncStatus.set('error');
        throw error;
    }
};

// Helper functions for journal operations
export const getJournals = async () => {
    const db = await getDB();
    return db.entries.find().sort({ updatedAt: 'desc' }).exec();
};

export const getJournal = async (id) => {
    const db = await getDB();
    return db.entries.findOne({selector: {id}}).exec();
};

export const createJournal = async (journalData) => {
    const db = await getDB();
    const timestamp = Date.now();
      return db.entries.insert({
        id: ID.unique(),
        createdAt: timestamp,
        updatedAt: timestamp,
        ...journalData
    });
};

export const updateJournal = async (id, journalData) => {
    const db = await getDB();
    const journal = await getJournal(id);
    
    if (!journal) throw new Error('Journal entry not found');
      return journal.update({
        $set: {
            ...journalData,
            updatedAt: Date.now()
        }
    });
};

export const deleteJournal = async (id) => {
    const db = await getDB();
    const journal = await getJournal(id);
    
    if (!journal) throw new Error('Journal entry not found');
    
    return journal.remove();
};
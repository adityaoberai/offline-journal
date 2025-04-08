import { createRxDatabase, addRxPlugin, RxCollectionBase } from 'rxdb/plugins/core';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { replicateAppwrite } from 'rxdb/plugins/replication-appwrite';
import { ID } from 'appwrite';
import { client, databases, appwriteConfig } from './appwrite.js';
import { writable } from 'svelte/store';

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
            storage: getRxStorageLocalstorage()
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

// Set up replication with Appwrite
const setupReplication = async (db) => {
    try {
        // Set status to online since we're not using authentication
        syncStatus.set('online');
        
        // Start replication
        const replicationState = replicateAppwrite({
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
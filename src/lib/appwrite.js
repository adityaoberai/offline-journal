import { Client, Databases, Account } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID, PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_APPWRITE_COLLECTION_ID } from '$env/static/public';

export const appwriteConfig = {
    endpoint: PUBLIC_APPWRITE_ENDPOINT,
    projectId: PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: PUBLIC_APPWRITE_DATABASE_ID,
    collectionId: PUBLIC_APPWRITE_COLLECTION_ID,
};

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setEndpointRealtime(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const account = new Account(client);
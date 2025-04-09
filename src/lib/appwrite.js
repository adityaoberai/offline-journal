import { Client, Databases, Account } from 'appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1', // Replace with your Appwrite endpoint
    projectId: 'journal-rxdb', // Replace with your Appwrite project ID
    databaseId: 'journals', // Replace with your Appwrite database ID
    collectionId: 'entries', // Replace with your Appwrite collection ID
};

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setEndpointRealtime(appwriteConfig.endpoint) // Set the endpoint for real-time updates
    .setProject(appwriteConfig.projectId);

export const databases = new Databases(client);
export const account = new Account(client);
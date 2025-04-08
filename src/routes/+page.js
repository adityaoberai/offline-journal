import { getJournals } from '$lib/database.js';

export async function load() {
    try {
        const journals = await getJournals();
        return {
            journals
        };
    } catch (error) {
        return {
            journals: [],
            error: error.message
        };
    }
}

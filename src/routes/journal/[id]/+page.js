import { getJournal } from '$lib/database.js';

export async function load({ params }) {
    try {
        const journal = await getJournal(params.id);
        return {
            journal,
            error: journal ? null : 'Journal entry not found'
        };
    } catch (error) {
        return {
            journal: null,
            error: error.message
        };
    }
}

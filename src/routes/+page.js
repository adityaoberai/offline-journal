import { redirect } from '@sveltejs/kit';
import { isProtectedRoute } from '$lib/auth.js';
import { getJournals } from '$lib/database';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const shouldProtect = await isProtectedRoute(url.pathname);
	if (shouldProtect) {
		throw redirect(303, '/login');
	}

	let journals = null;

	try {
		journals = await getJournals();
	} catch (err) {
		console.error('Error fetching journals:', err);
		journals = [];
	}

	return {
		journals
	}
}
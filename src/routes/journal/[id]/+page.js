import { redirect } from '@sveltejs/kit';
import { isProtectedRoute } from '$lib/auth.js';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const shouldProtect = await isProtectedRoute(url.pathname);
	if (shouldProtect) {
		throw redirect(303, '/login');
	}
}

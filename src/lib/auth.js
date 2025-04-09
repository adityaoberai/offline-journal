import { writable } from 'svelte/store';
import { account } from './appwrite.js';
import { goto } from '$app/navigation';
import { ID } from 'appwrite';

// Create stores for authentication state
export const user = writable(null);
export const isLoading = writable(true);
export const isAuthenticated = writable(false);

// Initialize authentication
export const initAuth = async () => {
	isLoading.set(true);
	try {
		// Check if user is already logged in
		const currentUser = await account.get();
		user.set(currentUser);
		isAuthenticated.set(true);
		return currentUser;
	} catch (error) {
		// User is not logged in
		user.set(null);
		isAuthenticated.set(false);
	} finally {
		isLoading.set(false);
	}
};

// Send magic URL link for authentication
export const sendMagicLink = async (email) => {
	try {
		// URL to redirect to after successful magic URL authentication
		const url = window.location.origin + '/auth/callback';
		const result = await account.createMagicURLToken(ID.unique(), email, url);
		return result;
	} catch (error) {
		console.error('Magic link error:', error);
		throw error;
	}
};

// Complete the magic URL authentication
export const completeMagicURLAuth = async (userId, secret) => {
	try {
		await account.createSession(userId, secret);
		const loggedInUser = await account.get();
		user.set(loggedInUser);
		isAuthenticated.set(true);
		return loggedInUser;
	} catch (error) {
		console.error('Magic URL auth error:', error);
		throw error;
	}
};

// Logout user
export const logout = async () => {
	try {
		await account.deleteSession('current');
		user.set(null);
		isAuthenticated.set(false);
		goto('/login'); // Redirect to login page
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
};

// Get current session
export const getSession = async () => {
	try {
		return await account.getSession('current');
	} catch (error) {
		return null;
	}
};

<script>
	import { onMount } from 'svelte';
	import { initAuth, isAuthenticated, isLoading } from '$lib/auth.js';
	import { goto } from '$app/navigation';
	import '../app.css';

	let { children } = $props();

	// Authentication state
	let authenticated = $state(false);
	let loading = $state(true);

	// Auth route patterns
	const AUTH_ROUTES = ['/login', '/auth/callback'];

	onMount(async () => {
		// Initialize authentication on app load
		await initAuth();

		// Subscribe to authentication state and loading state
		const authSubscribe = isAuthenticated.subscribe((value) => (authenticated = value));
		const loadingSubscribe = isLoading.subscribe((value) => (loading = value));

		// Check if we're on a protected route and redirect if not authenticated
		const currentPath = window.location.pathname;
		if (!authenticated && !loading && !isAuthRoute(currentPath)) {
			goto('/login');
		}

		return () => {
			authSubscribe();
			loadingSubscribe();
		};
	});

	// Function to check if current route is an auth route
	function isAuthRoute(path) {
		return AUTH_ROUTES.some(
			(route) => route === path || (route.endsWith('/callback') && path.startsWith(route))
		);
	}
</script>

{#if loading}
	<div class="loading-screen">
		<div class="spinner"></div>
		<p>Loading...</p>
	</div>
{:else}
	<!-- Always display page content after loading, whether authenticated or not -->
	<!-- This ensures auth pages like login are always displayed -->
	{@render children?.()}
{/if}

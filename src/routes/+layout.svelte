<script>
	import { onMount } from 'svelte';
	import { initAuth, isAuthenticated, isLoading } from '$lib/auth.js';
	import { goto } from '$app/navigation';

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

<style>
	.loading-screen {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f5f7fb;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top-color: #4a76a8;
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

<script>
	import { onMount } from 'svelte';
	import { initAuth, isAuthenticated, isLoading } from '$lib/auth.js';
	import { goto } from '$app/navigation';
	import '../app.css';

	let { children } = $props();

	// Authentication state
	let authenticated = $state(false);
	let loading = $state(true);
	onMount(async () => {
		// Initialize authentication on app load
		await initAuth();

		// Subscribe to authentication state and loading state
		const authSubscribe = isAuthenticated.subscribe((value) => (authenticated = value));
		const loadingSubscribe = isLoading.subscribe((value) => (loading = value));

		return () => {
			authSubscribe();
			loadingSubscribe();
		};
	});
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

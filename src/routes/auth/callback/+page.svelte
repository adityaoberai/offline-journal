<script>
	import { onMount } from 'svelte';
	import { completeMagicURLAuth } from '$lib/auth.js';
	import { goto } from '$app/navigation';

	let status = $state('verifying'); // verifying, success, error
	let error = $state('');

	onMount(async () => {
		try {
			// Get the userId and secret from URL parameters
			const url = new URL(window.location.href);
			const userId = url.searchParams.get('userId');
			const secret = url.searchParams.get('secret');

			if (!userId || !secret) {
				status = 'error';
				error = 'Invalid authentication link. Missing parameters.';
				return;
			}

			// Complete the magic URL authentication
			await completeMagicURLAuth(userId, secret);
			status = 'success';

			// Redirect to home page after successful authentication
			setTimeout(() => {
				goto('/');
			}, 1500);
		} catch (err) {
			status = 'error';
			error = err.message || 'Authentication failed. Please try again.';
		}
	});
</script>

<svelte:head>
	<title>Authenticating | Journal App</title>
</svelte:head>

<main>
	<div class="auth-callback-container">
		<div class="auth-callback-card">
			{#if status === 'verifying'}
				<div class="status-container">
					<div class="spinner"></div>
					<h2>Verifying your login...</h2>
					<p>Please wait while we authenticate your account.</p>
				</div>
			{:else if status === 'success'}
				<div class="status-container success">
					<div class="check-icon">✓</div>
					<h2>Login successful!</h2>
					<p>You are now logged in. Redirecting you to your journal...</p>
				</div>
			{:else}
				<div class="status-container error">
					<div class="error-icon">!</div>
					<h2>Authentication failed</h2>
					<p>{error}</p>
					<a href="/login" class="login-link">Return to login</a>
				</div>
			{/if}
		</div>
	</div>
</main>

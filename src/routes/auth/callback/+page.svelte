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

<style>
	main {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f7fb;
	}

	.auth-callback-container {
		width: 100%;
		max-width: 420px;
		padding: 20px;
	}

	.auth-callback-card {
		background-color: white;
		border-radius: 8px;
		padding: 30px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.status-container {
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		margin: 0 auto 20px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top-color: #4a76a8;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	h2 {
		margin: 0 0 16px 0;
		color: #333;
		font-size: 1.5rem;
	}

	p {
		color: #666;
		margin-bottom: 20px;
	}

	.check-icon,
	.error-icon {
		width: 60px;
		height: 60px;
		margin: 0 auto 20px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
	}

	.check-icon {
		background-color: #d4edda;
		color: #155724;
	}

	.error-icon {
		background-color: #f8d7da;
		color: #721c24;
	}

	.success h2 {
		color: #155724;
	}

	.error h2 {
		color: #721c24;
	}

	.login-link {
		display: inline-block;
		margin-top: 10px;
		padding: 10px 20px;
		background-color: #4a76a8;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
	}

	.login-link:hover {
		background-color: #3b5998;
	}
</style>

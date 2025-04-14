<script>
	import { preventDefault } from 'svelte/legacy';
	import { sendMagicLink, isAuthenticated, isLoading } from '$lib/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = $state('');
	let error = $state(null);
	let processing = $state(false);
	let magicLinkSent = $state(false);

	onMount(() => {
		// If user is already authenticated, redirect to home
		const unsubscribe = isAuthenticated.subscribe((value) => {
			if (value) {
				goto('/');
			}
		});

		return () => unsubscribe();
	});

	async function handleLogin() {
		if (!email) {
			error = 'Email is required';
			return;
		}

		try {
			error = null;
			processing = true;
			await sendMagicLink(email);
			magicLinkSent = true;
		} catch (err) {
			error = err.message || 'Failed to send login link. Please try again.';
		} finally {
			processing = false;
		}
	}
</script>

<svelte:head>
	<title>Login | Journal App</title>
</svelte:head>

<main class="centered-main">
	<div class="auth-container">
		<div class="auth-card">
			<h1>Login</h1>

			{#if error}
				<div class="error-message">
					<p>{error}</p>
					<button onclick={() => (error = null)}>Dismiss</button>
				</div>
			{/if}
			{#if !magicLinkSent}
				<form onsubmit={preventDefault(handleLogin)}>
					<div class="form-group">
						<label for="email">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							placeholder="Enter your email"
							disabled={processing}
							required
						/>
					</div>
					<div class="form-actions">
						<button type="submit" class="primary-btn" disabled={processing}>
							{processing ? 'Sending login link...' : 'Send me a login link'}
						</button>
					</div>
				</form>
			{:else}
				<div class="success-message">
					<h2>Login link sent!</h2>
					<p>
						We've sent a magic link to <strong>{email}</strong>. Please check your inbox and click
						the link to log in.
					</p>
					<button class="secondary-btn" onclick={() => (magicLinkSent = false)}>
						Send another link
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>

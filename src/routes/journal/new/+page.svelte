<script>
	import { preventDefault } from 'svelte/legacy';

	import { createJournal } from '$lib/database.js';
	import { goto } from '$app/navigation';
	let title = $state('');
	let content = $state('');
	let loading = $state(false);
	let error = $state(null);

	async function handleSubmit() {
		if (!title || !content) {
			error = 'Title and content are required.';
			return;
		}
		try {
			loading = true;
			const journal = await createJournal({
				title,
				content
			});

			// Navigate back to the main page
			goto('/');
		} catch (err) {
			error = err.message;
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>New Journal Entry</title>
</svelte:head>

<main>
	<header>
		<h1>New Journal Entry</h1>
		<a href="/" class="back-btn">← Back to Journal</a>
	</header>

	{#if error}
		<div class="error-message">
			<p>{error}</p>
			<button onclick={() => (error = null)}>Dismiss</button>
		</div>
	{/if}

	<form onsubmit={preventDefault(handleSubmit)}>
		<div class="form-group">
			<label for="title">Title</label>
			<input
				type="text"
				id="title"
				bind:value={title}
				placeholder="Enter a title for your journal entry"
				disabled={loading}
				required
			/>
		</div>
		<div class="form-group">
			<label for="content">Content</label>
			<textarea
				id="content"
				bind:value={content}
				placeholder="Write your thoughts here..."
				rows="15"
				disabled={loading}
				required
			></textarea>
		</div>

		<div class="form-actions">
			<button type="button" class="cancel-btn" onclick={() => goto('/')} disabled={loading}
				>Cancel</button
			>
			<button type="submit" class="save-btn" disabled={loading}>
				{loading ? 'Saving...' : 'Save Entry'}
			</button>
		</div>
	</form>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
		border-bottom: 1px solid #ddd;
		padding-bottom: 20px;
	}

	h1 {
		margin: 0;
		color: #333;
		font-size: 2rem;
	}

	.back-btn {
		text-decoration: none;
		color: #4a76a8;
		display: inline-flex;
		align-items: center;
	}

	.back-btn:hover {
		text-decoration: underline;
	}

	.error-message {
		background-color: #f8d7da;
		color: #721c24;
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	form {
		background-color: white;
		border-radius: 8px;
		padding: 30px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 8px;
		font-weight: 500;
	}

	input,
	textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	textarea {
		resize: vertical;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 15px;
		margin-top: 30px;
	}

	button {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.cancel-btn {
		background-color: #e9ecef;
		color: #495057;
	}

	.save-btn {
		background-color: #4a76a8;
		color: white;
	}

	.save-btn:hover:not(:disabled) {
		background-color: #3b5998;
	}
</style>

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

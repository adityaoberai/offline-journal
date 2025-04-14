<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { deleteJournal, getJournal } from '$lib/database.js';
	import { goto } from '$app/navigation';

	let journal = $state(null);
	let error = $state(null);
	let loading = $state(true);

	async function handleDelete() {
		if (confirm('Are you sure you want to delete this journal entry?')) {
			try {
				await deleteJournal(journal.id);
				goto('/');
			} catch (err) {
				error = err.message;
			}
		}
	}

	function formatDate(timestamp) {
		return new Date(timestamp).toLocaleString();
	}

	onMount(async () => {
		try {
			loading = true;
			journal = await getJournal(page.params.id);
			if (!journal) {
				error = 'Journal entry not found';
			}
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{journal ? journal.title : 'Loading...'} | Journal App</title>
</svelte:head>

<main>
	<header>
		<a href="/" class="back-btn">← Back to Journal</a>
	</header>

	{#if error}
		<div class="error-message">
			<p>{error}</p>
			<button onclick={() => (error = null)}>Dismiss</button>
		</div>
	{/if}
	{#if journal}
		<article class="journal-entry">
			<div class="journal-header">
				<h1>{journal.title}</h1>
				<div class="journal-actions">
					<a href={`/journal/${journal.id}/edit`} class="edit-btn">Edit</a>
					<button class="delete-btn" onclick={handleDelete}>Delete</button>
				</div>
			</div>
			<div class="journal-meta">
				<div class="timestamp">
					<span>Created: {formatDate(journal.createdAt)}</span>
					<span>Updated: {formatDate(journal.updatedAt)}</span>
				</div>
			</div>

			<div class="journal-content">
				<p>{journal.content}</p>
			</div>
		</article>
	{:else}
		<div class="not-found">
			<p>Journal entry not found</p>
			<a href="/">Return to Journal</a>
		</div>
	{/if}
</main>

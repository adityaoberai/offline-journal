<script>
	import { preventDefault } from 'svelte/legacy';
	import { page } from '$app/state';
	import { updateJournal, getJournal } from '$lib/database.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let journal = $state(null);
	let title = $state('');
	let content = $state('');
	let saving = $state(false);
	let error = $state(null);
	let loading = $state(true);

	async function handleSubmit() {
		if (!title || !content) {
			error = 'Title and content are required.';
			return;
		}

		try {
			saving = true;
			await updateJournal(journal.id, {
				title,
				content
			});

			// Navigate to the journal entry view
			goto(`/journal/${journal.id}`);
		} catch (err) {
			error = err.message;
			saving = false;
		}
	}

	onMount(async () => {
		try {
			loading = true;
			journal = await getJournal(page.params.id);
			if (journal) {
				title = journal.title;
				content = journal.content;
			} else {
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
	<title>Edit Journal Entry | Journal App</title>
</svelte:head>

<main>
	<header>
		<h1>Edit Journal Entry</h1>
		<a href={`/journal/${page.params.id}`} class="back-btn">← Back to Entry</a>
	</header>

	{#if error}
		<div class="error-message">
			<p>{error}</p>
			<button onclick={() => (error = null)}>Dismiss</button>
		</div>
	{/if}
	{#if loading}
		<p>Loading...</p>
	{:else if journal}
		<form onsubmit={preventDefault(handleSubmit)}>
			<div class="form-group">
				<label for="title">Title</label>
				<input
					type="text"
					id="title"
					bind:value={title}
					placeholder="Enter a title for your journal entry"
					disabled={saving}
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
					disabled={saving}
					required
				></textarea>
			</div>

			<div class="form-actions">
				<button
					type="button"
					class="cancel-btn"
					onclick={() => goto(`/journal/${journal.id}`)}
					disabled={saving}>Cancel</button
				>
				<button type="submit" class="save-btn" disabled={saving}>
					{saving ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</form>
	{:else}
		<div class="not-found">
			<p>Journal entry not found</p>
			<a href="/">Return to Journal</a>
		</div>
	{/if}
</main>

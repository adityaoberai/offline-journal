<script>
	import { onMount } from 'svelte';
	import { getJournals, deleteJournal, dbStatus, syncStatus, triggerSync } from '$lib/database.js';
	import JournalCard from '$lib/components/JournalCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	let journals = $state([]);
	let error = $state(null);
	let loading = $state(true);
	let syncing = $state(false);

	async function loadJournals() {
		try {
			loading = true;
			journals = await getJournals();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function deleteEntry(id) {
		if (confirm('Are you sure you want to delete this journal entry?')) {
			try {
				await deleteJournal(id);
				await loadJournals();
			} catch (err) {
				error = err.message;
			}
		}
	}

	async function handleSync() {
		if (syncing) return;
		try {
			syncing = true;
			await triggerSync();
			await loadJournals(); // Reload journals after sync
		} catch (err) {
			error = err.message;
		} finally {
			syncing = false;
		}
	}

	function formatDate(timestamp) {
		return new Date(timestamp).toLocaleString();
	}

	onMount(async () => {
		await loadJournals();
	});
</script>

<svelte:head>
	<title>Journal App</title>
</svelte:head>

<main>
	<Navbar />

	<header>
		<h1>My Journal</h1>
		<div class="status-bar">
			<div class="status-indicator">
				DB Status: <span class={$dbStatus}>{$dbStatus}</span>
			</div>
			<div class="status-indicator">
				Sync Status: <span class={$syncStatus}>{$syncStatus}</span>
				<button
					class="sync-btn"
					disabled={$syncStatus === 'syncing' || syncing}
					onclick={handleSync}
				>
					{syncing ? 'Syncing...' : 'Sync Now'}
				</button>
			</div>
		</div>
	</header>

	{#if error}
		<div class="error-message">
			<p>{error}</p>
			<button onclick={() => (error = null)}>Dismiss</button>
		</div>
	{/if}

	<div class="actions">
		<a href="/journal/new" class="new-entry-btn">New Journal Entry</a>
	</div>

	{#if loading}
		<div class="loading">Loading...</div>
	{:else if journals.length === 0}
		<div class="empty-state">
			<p>You don't have any journal entries yet.</p>
			<a href="/journal/new">Create your first entry</a>
		</div>
	{:else}
		<div class="journal-entries">
			{#each journals as journal (journal.id)}
				<JournalCard {journal} onDelete={deleteEntry} />
			{/each}
		</div>
	{/if}
</main>



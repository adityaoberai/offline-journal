<script>
    import { getJournals, deleteJournal, dbStatus, syncStatus } from '$lib/database.js';
    import JournalCard from '$lib/components/JournalCard.svelte';
    
    let { data } = $props();
    
    let journals = $state(data.journals);
    let error = $state(data.error || null);
    let loading = $state(false);
    
    async function loadJournals() {
        try {
            loading = true;
            const result = await getJournals();
            journals = result;
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
    
    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }
</script>

<svelte:head>
    <title>Journal App</title>
</svelte:head>

<main>
    <header>
        <h1>My Journal</h1>
        <div class="status-bar">
            <div class="status-indicator">
                DB Status: <span class={$dbStatus}>{$dbStatus}</span>
            </div>
            <div class="status-indicator">
                Sync Status: <span class={$syncStatus}>{$syncStatus}</span>
            </div>
        </div>
    </header>

    {#if error}
        <div class="error-message">
            <p>{error}</p>
            <button onclick={() => error = null}>Dismiss</button>
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

<style>
    main {
        max-width: 960px;
        margin: 0 auto;
        padding: 20px;
    }
    
    header {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
    }
    
    h1 {
        margin: 0;
        color: #333;
        font-size: 2rem;
    }
    
    .status-bar {
        display: flex;
        gap: 20px;
        font-size: 0.9rem;
    }
    
    .status-indicator {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .status-indicator span {
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .status-indicator .ready,
    .status-indicator .online {
        background-color: #d4edda;
        color: #155724;
    }
    
    .status-indicator .syncing {
        background-color: #cce5ff;
        color: #004085;
    }
    
    .status-indicator .error {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .status-indicator .offline,
    .status-indicator .initializing,
    .status-indicator .creating {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .user-info, .auth-links {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
    }
    
    button, .new-entry-btn {
        background-color: #4a76a8;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.9rem;
        display: inline-block;
    }
    
    button:hover, .new-entry-btn:hover {
        background-color: #3b5998;
    }
    
    .actions {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-end;
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
    
    .loading, .empty-state {
        text-align: center;
        padding: 40px;
        color: #6c757d;
    }
    
    .journal-entries {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    @media (max-width: 768px) {
        .journal-entries {
            gap: 15px;
        }
    }
</style>
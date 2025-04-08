<script>    import { deleteJournal } from '$lib/database.js';
    import { goto } from '$app/navigation';
    
    let { data } = $props();
    let journal = $state(data.journal);
    let error = $state(data.error);

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
            <button onclick={() => error = null}>Dismiss</button>
        </div>
    {/if}    {#if journal}
        <article class="journal-entry">
            <div class="journal-header">
                <h1>{journal.title}</h1>
                <div class="journal-actions">
                    <a href={`/journal/${journal.id}/edit`} class="edit-btn">Edit</a>
                    <button class="delete-btn" onclick={handleDelete}>Delete</button>
                </div>
            </div><div class="journal-meta">
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

<style>
    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
    
    header {
        margin-bottom: 30px;
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
      .not-found {
        text-align: center;
        padding: 40px;
        color: #6c757d;
    }
    
    .journal-entry {
        background-color: white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .journal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
    }
    
    h1 {
        margin: 0;
        color: #333;
        font-size: 2rem;
    }
    
    .journal-actions {
        display: flex;
        gap: 10px;
    }
    
    .edit-btn, .delete-btn {
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 0.9rem;
        text-decoration: none;
        cursor: pointer;
    }
    
    .edit-btn {
        background-color: #e2e3e5;
        color: #383d41;
        display: inline-block;
    }
    
    .delete-btn {
        background-color: #f8d7da;
        color: #721c24;
        border: none;
    }
    
    .journal-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
        font-size: 0.9rem;
        color: #6c757d;
    }
      .timestamp {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .journal-content {
        line-height: 1.6;
        white-space: pre-wrap;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .journal-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .journal-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
    }
</style>

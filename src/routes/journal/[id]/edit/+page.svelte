<script>
    import { preventDefault } from 'svelte/legacy';
    import { page } from '$app/stores';
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
            journal = await getJournal($page.params.id);
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
        <a href={`/journal/${$page.params.id}`} class="back-btn">← Back to Entry</a>
    </header>

    {#if error}
        <div class="error-message">
            <p>{error}</p>
            <button onclick={() => error = null}>Dismiss</button>
        </div>
    {/if}
    {#if loading}
        <p>Loading...</p>
    {:else}
        {#if journal}
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
                    <button type="button" class="cancel-btn" onclick={() => goto(`/journal/${journal.id}`)} disabled={saving}>Cancel</button>
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
    {/if}
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
    
    .not-found {
        text-align: center;
        padding: 40px;
        color: #6c757d;
    }
    
    form {
        background-color: white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
    }
    
    input, textarea {
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

<script>
    let { journal, onDelete } = $props();

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }
</script>

<div class="journal-card">
    <div class="journal-header">
        <h2>{journal.title}</h2>
        <div class="journal-actions">
            <a href={`/journal/${journal.id}`} class="view-btn">View</a>
            <a href={`/journal/${journal.id}/edit`} class="edit-btn">Edit</a>
            <button class="delete-btn" onclick={() => onDelete(journal.id)}>Delete</button>
        </div>
    </div>
    <div class="journal-preview">
        {#if journal.content.length > 150}
            <p>{journal.content.substring(0, 150)}...</p>
        {:else}
            <p>{journal.content}</p>
        {/if}
    </div>
    <div class="journal-footer">
        <div class="timestamp">
            <span>Created: {formatDate(journal.createdAt)}</span>
            <span>Updated: {formatDate(journal.updatedAt)}</span>
        </div>
    </div>
</div>

<style>
    .journal-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .journal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .journal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #333;
    }
    
    .journal-actions {
        display: flex;
        gap: 10px;
    }
    
    .view-btn, .edit-btn {
        padding: 5px 10px;
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.8rem;
    }
    
    .view-btn {
        background-color: #e9ecef;
        color: #495057;
    }
    
    .edit-btn {
        background-color: #e2e3e5;
        color: #383d41;
    }
    
    .delete-btn {
        background-color: #f8d7da;
        color: #721c24;
        padding: 5px 10px;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .journal-preview {
        margin: 10px 0;
        color: #666;
        line-height: 1.5;
    }
    
    .journal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        font-size: 0.8rem;
        color: #6c757d;
    }
    
    .timestamp {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 5px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .journal-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
        
        .journal-actions {
            width: 100%;
            justify-content: flex-start;
        }
        
        .journal-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
        
        .timestamp {
            align-items: flex-start;
        }
    }
</style>

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

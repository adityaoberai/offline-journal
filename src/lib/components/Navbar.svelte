<script>
	import { user, logout } from '$lib/auth.js';

	let userData = $state(null);

	// Handle logout
	async function handleLogout() {
		try {
			await logout();
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	// Subscribe to user data
	$effect(() => {
		const unsubscribe = user.subscribe((value) => {
			userData = value;
		});

		return unsubscribe;
	});
</script>

<nav>
	<div class="nav-container">
		<div class="nav-brand">
			<a href="/">
				<img src="/favicon.png" alt="Journal Icon" class="brand-icon" />
				<span class="app-name">Offline Journal</span>
			</a>
		</div>
		<div class="nav-user">
			{#if userData}
				<span class="user-name">{userData.name}</span>
			{/if}
			<button onclick={handleLogout} class="logout-btn">Logout</button>
		</div>
	</div>
</nav>

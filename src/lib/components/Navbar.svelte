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
			</a>
		</div>
		<div class="nav-user">
			{#if userData}
				<span>{userData.name}</span>
			{/if}
			<button onclick={handleLogout} class="logout-btn">Logout</button>
		</div>
	</div>
</nav>

<style>
	nav {
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 10px 0;
		position: sticky;
		top: 0;
		z-index: 1000;
		margin-bottom: 20px;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.brand-icon {
		width: 48px;
		height: auto;
		object-fit: contain;
	}

	.nav-links {
		display: flex;
		gap: 20px;
	}

	.nav-links a {
		color: #555;
		text-decoration: none;
		font-weight: 500;
	}

	.nav-links a:hover {
		color: #4a76a8;
	}

	.nav-user {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.nav-user span {
		font-weight: 500;
	}

	.logout-btn {
		background-color: transparent;
		border: 1px solid #4a76a8;
		color: #4a76a8;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.logout-btn:hover {
		background-color: #4a76a8;
		color: white;
	}
</style>

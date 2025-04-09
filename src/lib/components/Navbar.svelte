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

	.nav-brand a {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: #333;
	}

	.brand-icon {
		width: 48px;
		height: auto;
		object-fit: contain;
	}

	.app-name {
		margin-left: 10px;
		font-weight: 600;
		font-size: 1.2rem;
		display: block;
	}

	.user-name {
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 150px;
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

	/* Mobile responsive styles */
	@media (max-width: 768px) {
		.nav-container {
			padding: 0 15px;
		}

		.brand-icon {
			width: 36px;
		}

		.app-name {
			font-size: 1rem;
		}

		.nav-user {
			gap: 8px;
		}

		.user-name {
			max-width: 100px;
		}

		.logout-btn {
			padding: 5px 10px;
			font-size: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.app-name {
			display: none;
		}

		.user-name {
			max-width: 80px;
		}

		.nav-user {
			flex-wrap: wrap;
			justify-content: flex-end;
		}
	}
</style>

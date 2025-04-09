<script>
    import { preventDefault } from 'svelte/legacy';
    import { sendMagicLink, isAuthenticated, isLoading } from '$lib/auth.js';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let email = $state('');
    let error = $state(null);
    let processing = $state(false);
    let magicLinkSent = $state(false);
    
    onMount(() => {
        // If user is already authenticated, redirect to home
        const unsubscribe = isAuthenticated.subscribe(value => {
            if (value) {
                goto('/');
            }
        });
        
        return () => unsubscribe();
    });
    
    async function handleLogin() {
        if (!email) {
            error = 'Email is required';
            return;
        }
        
        try {
            error = null;
            processing = true;
            await sendMagicLink(email);
            magicLinkSent = true;
        } catch (err) {
            error = err.message || 'Failed to send login link. Please try again.';
        } finally {
            processing = false;
        }
    }
</script>

<svelte:head>
    <title>Login | Journal App</title>
</svelte:head>

<main>
    <div class="auth-container">
        <div class="auth-card">
            <h1>Login</h1>
            
            {#if error}
                <div class="error-message">
                    <p>{error}</p>
                    <button onclick={() => error = null}>Dismiss</button>
                </div>
            {/if}
              {#if !magicLinkSent}
                <form onsubmit={preventDefault(handleLogin)}>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            bind:value={email} 
                            placeholder="Enter your email" 
                            disabled={processing}
                            required
                        />
                    </div>
                      <div class="form-actions">
                        <button type="submit" class="primary-btn" disabled={processing}>
                            {processing ? 'Sending login link...' : 'Send me a login link'}
                        </button>
                    </div>
                </form>
            {:else}
                <div class="success-message">
                    <h2>Login link sent!</h2>
                    <p>We've sent a magic link to <strong>{email}</strong>. Please check your inbox and click the link to log in.</p>
                    <button class="secondary-btn" onclick={() => magicLinkSent = false}>
                        Send another link
                    </button>
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    main {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fb;
    }
    
    .auth-container {
        width: 100%;
        max-width: 420px;
        padding: 20px;
    }
    
    .auth-card {
        background-color: white;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    h1 {
        margin: 0 0 24px 0;
        color: #333;
        font-size: 1.8rem;
        text-align: center;
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
    
    .form-group {
        margin-bottom: 20px;
    }
    
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
    }
    
    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }
    
    .form-actions {
        margin-top: 30px;
    }
    
    button {
        padding: 12px;
        width: 100%;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    }
    
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .primary-btn {
        background-color: #4a76a8;
        color: white;
    }
    
    .primary-btn:hover:not(:disabled) {
        background-color: #3b5998;
    }
    
    .success-message {
        text-align: center;
        padding: 20px;
        background-color: #d4edda;
        color: #155724;
        border-radius: 4px;
    }
    
    .success-message h2 {
        color: #155724;
        margin-bottom: 16px;
    }
    
    .secondary-btn {
        background-color: white;
        color: #4a76a8;
        border: 1px solid #4a76a8;
        margin-top: 20px;
    }
    
    .secondary-btn:hover {
        background-color: #edf2f7;
    }
</style>

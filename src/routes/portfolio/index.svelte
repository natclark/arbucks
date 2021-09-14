<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import portfolioWallets from '$lib/stores/portfolioWallets';
    import Modal from 'svelte-simple-modal';
    import NewWallet from '$lib/components/Modals/NewWallet.svelte';
    import Wallet from '$lib/components/Portfolio/Wallet.svelte';

    let ls;
    let newPortfolioWallets = [];

    let address;

    const handleSubmit = () => goto(`/portfolio/${address}/`);

    onMount(() => {
        if (typeof localStorage !== `undefined`) {
            ls = localStorage;
            if (ls.getItem(`arbucks::v0:wallets`) !== null) {
                try {
                    JSON.parse(ls.getItem(`arbucks::v0:wallets`)).forEach((wallet) => {
                        newPortfolioWallets.push({
                            name: wallet.name,
                            address: wallet.address,
                        });
                    });
                    portfolioWallets.update(() => newPortfolioWallets);
                } catch (e) {
                    newPortfolioWallets = [];
                    portfolioWallets.update(() => newPortfolioWallets);
                }
            }
        }
    });
</script>

<svelte:head>
    <title>Track Any Arbitrum Wallet in Real-Time - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/portfolio/">
    <meta property="og:title" content="Track Any Arbitrum Wallet in Real-Time - Arbucks">
    <meta name=twitter:title content="Track Any Arbitrum Wallet in Real-Time - Arbucks">
</svelte:head>

<div class="top">
    <br>
    <h1>Arbitrum Portfolio Tracker</h1>
    <p>Track the value of a wallet's Arbitrum digital assets in real-time!</p>
</div>

<form class="input" on:submit|preventDefault={handleSubmit}>
    <input bind:value={address} class="input__field" type="text" placeholder="Search any wallet address...">
</form>

<div class="top">
    <br>
    <br>
    <h2>Saved Wallets</h2>
    <p>Save wallets for easy access!</p>
    <Modal>
        <NewWallet />
    </Modal>
    <br>
    {#if $portfolioWallets.length > 0}
        <div class="scroller">
            <table class="wallets">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $portfolioWallets as wallet}
                        <Wallet name={wallet.name} address={wallet.address} />
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <p><em>Looks like you haven't saved any wallets yet!</em></p>
    {/if}
</div>

<style>
    .top {
        text-align: center;
    }
    .input {
        align-items: center;
        display: flex;
        justify-content: center;
        margin-top: 80px;
        .input__field {
            background-color: var(--bg-input);
            border: 0;
            border-radius: 24px;
            color: #fff;
            font-size: 1.275rem;
            letter-spacing: .2px;
            line-height: 1.25rem;
            text-shadow: 0 0 16px rgba(60, 100, 255, .2);
            outline: none;
            padding: 1rem;
            transition: all .08s ease-in;
            width: 80%;
            will-change: box-shadow;
            &::-ms-input-placeholder, &:-ms-input-placeholder, *::placeholder {
                color: #888;
            }
            &::placeholder {
                opacity: 1;
            }
            &:hover, &:focus, &:active {
                box-shadow: rgba(0, 0, 0, .4) 0 30px 90px;
            }
            &:focus {
                box-shadow: rgba(0, 0, 0, .16) 0 1px 4px, var(--fg-header) 0 0 0 2px;
            }
        }
    }
    .scroller {
        overflow-x: auto;
        .wallets {
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 32px;
            width: 100%;
            thead th {
                text-align: left;
                &:last-child {
                    text-align: right;
                }
            }
        }
    }
    @media screen and (min-width: 768px) {
        .wallets {
            border-collapse: separate !important;
            border-spacing: 0 1em !important;
        }
    }
</style>

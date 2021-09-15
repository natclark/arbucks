<script>
    import { onMount } from 'svelte';
    import { defaultChainStore, web3, selectedAccount, connected, chainData } from 'svelte-web3';
    import wallet from '$lib/stores/wallet';

    let balance = `0.00`;

    const updateBalance = async () => {
        if ($wallet !== ``) {
            /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
            const COVALENT_KEY = `ckey_f02916bdd2b04038bc0808fb3bc`;
            const timestamp = Math.floor(new Date().getTime() / 1000);
            const history = await fetch(`https://api.covalenthq.com/v1/42161/address/${$wallet}/portfolio_v2/?key=${COVALENT_KEY}`);
            const jsonHistory = await history.json();
            jsonHistory.items.forEach((item) => item.contract_address === `0xafd871f684f21ab9d7137608c71808f83d75e6fc` && (balance = (item.holdings[0].close.balance)) / (10 ** 18));
        }
    };

    const connect = () => {
        if (typeof window.ethereum !== `undefined`) {
            window.ethereum.request({ method: `eth_requestAccounts`, });
        } else {
            alert(`You must have a web3-enabled Ethereum wallet like Metamask to do this!`);
        }
    };

    onMount(async () => {
        if (typeof window.ethereum !== `undefined`) {
            const currentAccounts = await ethereum.request({ method: `eth_requestAccounts` });
            wallet.update(() => currentAccounts[0]);
            updateBalance();
            window.ethereum.on(`accountsChanged`, (newAccounts) => {
                wallet.update(() => newAccounts[0]);
                updateBalance();
            });
        }
    });
</script>

<svelte:head>
    <title>DAO Portal - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/dao/">
    <meta property="og:title" content="DAO Portal - Arbucks">
    <meta name=twitter:title content="DAO Portal - Arbucks">
    <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
</svelte:head>

<div class="top">
    <br>
    <h1>ArbiDAO</h1>
    <p>The world's first L2-native DAO.</p>
</div>

<div class="flex flex--center">
    {#if $wallet === ``}
        <a class="primary" role="button" draggable="false" on:click={connect}>
            <span class="primary__shadow"></span>
            <span class="primary__edge"></span>
            <span class="primary__front">Connect Wallet</span>
        </a>
    {:else}
        <a class="primary" role="button" draggable="false">
            <span class="primary__shadow"></span>
            <span class="primary__edge"></span>
            <span class="primary__front">{$wallet}</span>
        </a>
    {/if}
</div>

<div class="flex">
    <div class="top">
        <h2>DAO Treasury</h2>
        <p>5,781,696.999</p>
    </div>
    <div class="top">
        <h2>My Balance</h2>
        <p>{balance}</p>
    </div>
</div>

<div class="top">
    <p><em>Proposal creation and voting is coming very soon!</em></p>
</div>

<div class="flex flex--center">
    <div class="content">

        <h2>About ArbiDAO</h2>

        <p>ArbiDAO is the first DAO (decentralized autonomous organization) native to an Ethereum Layer 2 network and the first DAO native to Arbitrum.</p>

        <p>The current primary objective of this DAO is to create excellent user-facing open-source products on Arbiturm, including price charts and token analytics.</p>

        <p>Participation in this DAO is powered and incentivized by the BUCK token, a token with a fixed supply of 100,000,000 (100M).</p>

        <p>8% of the BUCK supply has been allocated to the ArbiDAO treasury.</p>
        
        <p>However, when dxSale platform fees for getting the token set up are subtracted (about 2.3%), this allocation is actually about 5.7% of the supply, specifically 5,781,696.999 tokens.</p>

        <p>It's up to BUCK holders to create and vote on proposals that push the project forward!</p>

        <p>Anyone with BUCK tokens can permissionlessly participate in ArbiDAO.</p>

        <p>There is no formal membership process or anything - if you're a BUCK tokenholder, you're technically a "member". And you don't have to vote on any proposals if you don't want to - it's all voluntary!</p>

        <p>Members of ArbiDAO like to hang out and coordinate things on Telegram sometimes, but anyone is welcome to branch off and create their own working groups. Most ArbiDAO members typically communicate in English.</p>

        <h2>About This Portal</h2>

        <p>This portal is open-source, just like the rest of this website.</p>

        <p>You can download the code and run it yourself, or create your own portal!</p>

        <p>This portal just talks to a governance smart contract and has no centralized back-end. Pretty neat, right?</p>

        <p><em>More details are coming soon, when proposal functionality releases!</em></p>

        <br>

    </div>
</div>

<style>
    .top {
        text-align: center;
    }
    .flex {
        align-items: center;
        display: flex;
        justify-content: space-around;
        .primary {
            display: block;
        }
        &.flex--center {
            justify-content: center;
        }
    }
    .content {
        max-width: 600px;
        h2, h3 {
            text-align: center;
        }
    }
</style>

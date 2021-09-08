<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let loading = true;
    let valid = false;

    let token = null;
    let liquidity = null;
    let volume = null;
    let transactions = null;

    onMount(async () => {
        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const pair = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=${$page.params.slug}&chainID=42161`);
        const jsonPair = await pair.json();

        if (typeof jsonPair.error === `undefined`) {
            valid = true;
            token = jsonPair[0];

            /*
            TODO
            const liquidityReq = await fetch(`https://api2.sushipro.io/?action=get_historical_liquidity&pair=${$page.params.slug}&from=${timestamp - 86400}&to=${timestamp}&chainID=42161`);
            liquidity = await liquidityReq.json();

            const volumeReq = await fetch(`https://api2.sushipro.io/?action=get_historical_volume&pair=${$page.params.slug}&from=${timestamp - 86400}&to=${timestamp}&chainID=42161`);
            volume = await volumeReq.json();

            const transactionsReq = await fetch(`https://api2.sushipro.io/?action=get_historical_transactions_count&pair=${$page.params.slug}&from=${timestamp - 86400}&to=${timestamp}&chainID=42161`);
            transactions = await transactionsReq.json();
            */
        } else {
            goto(`/charts/`);
        }

        loading = false;
    });
</script>

{#if !!token && !!valid}
    <h1>{token.Token_1_symbol} / {token.Token_2_symbol}</h1>

    Address: {$page.params.slug}

    <p><em>Coming soon!</em></p>
{:else if token === null && valid === false && loading === false}
    <h1>Invalid Token</h1>
    <p>Redirecting...</p>
{/if}

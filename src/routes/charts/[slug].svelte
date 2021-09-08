<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Moon } from 'svelte-loading-spinners';

    let loading = true;
    let valid = false;
    let ethPrice = -1;

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
            /*
            TODO
            const ethPriceReq = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad&chainID=42161`);
            const jsonEthPrice = await ethPriceReq.json();
            typeof jsonEthPrice.error === `undefined` && (ethPrice = jsonEthPrice[0].Token_2_price);
            */

            valid = true;
            token = jsonPair[0];

            const liquidityReq = await fetch(`https://api2.sushipro.io/?action=get_historical_liquidity&pair=${$page.params.slug}&from=${timestamp - 604800}&to=${timestamp}&chainID=42161`);
            const jsonLiquidity = await liquidityReq.json();
            typeof jsonLiquidity.error === `undefined` && (liquidity = jsonLiquidity);

            const volumeReq = await fetch(`https://api2.sushipro.io/?action=get_historical_volume&pair=${$page.params.slug}&from=${timestamp - 604800}&to=${timestamp}&chainID=42161`);
            const jsonVolume = await volumeReq.json();
            typeof jsonVolume.error === `undefined` && (volume = jsonVolume);

            const transactionsReq = await fetch(`https://api2.sushipro.io/?action=get_historical_transactions_count&pair=${$page.params.slug}&from=${timestamp - 604800}&to=${timestamp}&chainID=42161`);
            const jsonTransactions = await transactionsReq.json();
            typeof jsonTransactions.error === `undefined` && (transactions = jsonTransactions);
        } else {
            goto(`/charts/`);
        }

        loading = false;
    });
</script>
{#if !!loading}
    <div class="loading">
        <Moon size="60" color="rgba(255, 62, 0, .8)" unit="px" duration="1s" />
    </div>
{:else}
    {#if !!token && !!valid}
        <h1 class="title">{token.Token_1_symbol} / {token.Token_2_symbol}</h1>
        <p class="subtitle"><span class="bold">{token.Token_1_name} / {token.Token_2_name}</span> (<a href="https://arbiscan.io/token/{$page.params.slug}" rel="external noopener" target="_blank">{$page.params.slug}</a>)</p>
        <div class="flex">
            <div class="left">
                <h2>{token.Token_2_price} {token.Token_2_symbol}</h2>
            </div>
            <div class="right">
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_1_contract}">Buy {token.Token_1_symbol}</a>
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_2_contract}">Buy {token.Token_2_symbol}</a>
            </div>
        </div>

        <p><em>Coming soon!</em></p>

        <h2>Liquidity</h2>
        {#if !!liquidity}
            <p><em>Coming soon!</em></p>
        {:else}
            <p>No liquidity data is available for this pair.</p>
        {/if}

        <h2>Volume</h2>
        {#if !!volume}
            <p><em>Coming soon!</em></p>
        {:else}
            <p>No volume data is available for this pair.</p>
        {/if}

        <h2>Transactions</h2>
        {#if !!transactions}
            <p><em>Coming soon!</em></p>
        {:else}
            <p>No transaction data is available for this pair.</p>
        {/if}
    {:else if token === null && valid === false}
        <h1>Invalid Token</h1>

        <p><em>Redirecting...</em></p>
    {/if}
{/if}

<style>
    .loading {
        align-items: center;
        display: flex;
        margin-top: 20px;
        justify-content: center;
    }
    .title {
        margin-bottom: 8px;
    }
    .subtitle {
        color: #333;
        font-size: 14px;
    }
    .bold {
        font-weight: 700;
    }
    .flex {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin: 24px 0;
        .left h2 {
            margin: 0;
        }
        .right a {
            margin-left: 4px;
        }
    }
</style>

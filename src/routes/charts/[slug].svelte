<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Moon } from 'svelte-loading-spinners';
    import Search from '$lib/components/Search/index.svelte';
    import Chart from '$lib/components/Chart/index.svelte';

    let loading = true;
    let valid = false;
    let ethPrice = -1;

    let token = null;
    let liquidity = null;
    let volume = null;
    let transactions = null;

    const refresh = async () => {
        loading = true;

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

            console.log(volume);
        } else {
            goto(`/charts/`);
        }

        loading = false;
    };

    onMount(refresh);

    $: $page.params.slug, refresh();
</script>

{#if !!loading}
    <div class="loading">
        <Moon size="60" color="rgba(255, 62, 0, .8)" unit="px" duration="1s" />
    </div>
{:else}
    {#if !!token && !!valid}
        <div class="flex">
            <div>
                <h1 class="title">{token.Token_1_symbol} / {token.Token_2_symbol}</h1>
                <p class="subtitle"><span class="bold">{token.Token_1_name} / {token.Token_2_name}</span> (<a href="https://arbiscan.io/token/{$page.params.slug}" rel="external noopener" target="_blank">{$page.params.slug}</a>)</p>
            </div>
            <Search />
        </div>
        <div class="flex flex--center">
            <div class="left">
                <h2>{token.Token_2_price} {token.Token_2_symbol}</h2>
            </div>
            <div class="right">
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_1_contract}" rel="external noopener" target="_blank" draggable="false">Buy {token.Token_1_symbol}</a>
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_2_contract}" rel="external noopener" target="_blank" draggable="false">Buy {token.Token_2_symbol}</a>
            </div>
        </div>
        <div class="details">
            <p class="flex"><span class="bold">24H Volume (USDT)</span><span>{!!volume ? new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(volume[1][volume[1].length - 2].USD_total_volume) : 0}</span></p>
        </div>

        <Chart id="0" address="0xf97f4df75117a78c1a5a0dbb814af92458539fb4" />
        <p>If this chart looks blank to you, that's because it is indeed blank. It'll be filled with data soon though!</p>

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

        <h2>Trades</h2>
        {#if !!transactions}
            <p>{transactions[0].number_of_results} trades in the past week</p>
            <p><em>More data coming soon!</em></p>
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
        display: block;
        margin: 24px 0;
    }
    .details {
        border: 1px solid #d2b48c;
        border-width: 1px 0 1px 0;
        margin-bottom: 24px;
        width: 50%;
        p.flex {
            margin: 12px 0;
        }
    }
    @media screen and (min-width: 768px) {
        .flex {
            display: flex;
            justify-content: space-between;
            .left h2 {
                margin: 0;
            }
            .right a {
                margin-left: 4px;
            }
            &.flex--center {
                align-items: center;
            }
        }
    }
</style>

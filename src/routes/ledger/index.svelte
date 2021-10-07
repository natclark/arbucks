<script>
    import { onMount } from 'svelte';
    import orders from '$lib/stores/orders';
    import Loader from '$lib/components/Loader/index.svelte';
    import Order from '$lib/components/Order/index.svelte';

    let loading = true;

    let maxResults = 500;
    let minValue = 0;
    let newOrders = [];

    const refresh = async () => {
        newOrders = [];
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const json = JSON.parse(xhr.response); // TODO check for errors
            const graphSwaps = json.data.swaps;

            graphSwaps.forEach((swap) => newOrders.push({
                id: swap.id.toLowerCase(),
                timestamp: swap.timestamp,
                type: swap.amount0In > 0 ? `Buy` : `Sell`,
                pairAddress: swap.pair.id,
                pairName: swap.pair.name,
                tokenAddress: swap.pair.token0.id,
                tokenName: swap.pair.token0.name !== `Wrapped Ether` ? swap.pair.token0.name : swap.pair.token1.name,
                sender: swap.sender,
                amount: swap.amountUSD,
            }));

            orders.update(() => newOrders);
        };
        xhr.onerror = () => {
            console.log(`Request failed.`);
        };
        /* The Graph has issues, but it'll have to do for now. */
        xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
        xhr.setRequestHeader(`Content-Type`, `application/json`);
        xhr.send(JSON.stringify({
            query: `{\n  swaps(where: {timestamp_gt: ${Math.floor(new Date().getTime() / 1000) - 86400}, amountUSD_gt: ${minValue}}, orderBy: timestamp, orderDirection: desc, first: ${maxResults}) {\n    id\n    timestamp\n    amount0In\n    pair {\n        id\n        name\n        token0 {\n          id\n          name\n        }\n        token1 {\n          id\n          name\n        }\n    }\n        sender\n    amountUSD\n  }\n\t}\n`,
            variables: null,
        }));

        loading = false;
    };

    onMount(() => {
        refresh();
        window.setInterval(refresh, 10000);
    });
</script>

<svelte:head>
    <title>Real-Time Arbitrum Order Book - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/tokens/">
    <meta property="og:title" content="Real-Time Arbitrum Order Book - Arbucks">
    <meta name=twitter:title content="Real-Time Arbitrum Order Book - Arbucks">
</svelte:head>

<h1>Arbitrum Token Swap Ledger</h1>

<p class="subtitle">Real-time order book for the last hour of Sushiswap trades on Arbitrum One. This page updates every 10 seconds. <strong>Uniswap orders are coming soon!</strong></p>

<div class="flex">
    <div>
        <label for="maxResults">Results</label>
        <input bind:value={maxResults} id="maxResults" type="number" min="1" max="1000" />
    </div>
    <div>
        <label for="minValue">Minimum Value (USDT)</label>
        <input bind:value={minValue} id="minValue" type="number" min="0" />
    </div>
</div>

<br>

{#if !!loading}
    <div class="loading">
        <Loader />
    </div>
{:else}
    <div class="scroller">
        <table class="tokens">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Amount (USDT)</th>
                    <th>Price Impact</th>
                    <th>Token</th>
                    <th>Pair</th>
                    <th>TX Hash</th>
                </tr>
            </thead>
            <tbody>
                {#each $orders as order}
                    <Order timestamp={order.timestamp} type={order.type} amount={order.amount} address={order.id} pair={order.pairAddress} name={order.tokenName} sender={order.sender} />
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style>
    .loading {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .flex {
        display: block;
        div {
            align-items: center;
            display: flex;
            justify-content: space-between;
            input {
                background-color: var(--bg-soft);
                border: 0;
                border-radius: 16px;
                color: #fff;
                font-size: 1rem;
                letter-spacing: .2px;
                line-height: 1.25rem;
                text-shadow: 0 0 16px rgba(60, 100, 255, .2);
                outline: none;
                padding: .3rem;
                transition: all .08s ease-in;
                width: 200px;
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
                    box-shadow: rgba(0, 0, 0, .16) 0 1px 4px, var(--ac) 0 0 0 2px;
                }
            }
        }
    }
    .scroller {
        overflow-x: auto;
        .tokens {
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 32px;
            width: 100%;
            thead th {
                font-family: var(--font-bold);
                font-size: 20px;
                text-align: left;
            }
        }
    }
    @media screen and (min-width: 768px) {
        .flex {
            align-items: center;
            display: flex !important;
            justify-content: space-around;
            div {
                display: block !important;
            }
        }
    }
</style>


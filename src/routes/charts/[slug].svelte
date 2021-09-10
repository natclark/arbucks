<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Moon } from 'svelte-loading-spinners';
    import Copy from '$lib/components/Copy/index.svelte';
    import Search from '$lib/components/Search/index.svelte';
    import Chart from '$lib/components/Chart/index.svelte';
    import Trade from '$lib/components/Trade/index.svelte';

    let loading = true;
    let valid = false;
    let ethPrice = -1;

    let token = null;
    let liquidity = null;
    let volume = null;

    let supply = 0;
    let txCount = 0;
    let swaps = [];

    let zeroes = ``;
    let price = ``;
    let volume24 = ``;

    const refresh = async () => {
        loading = true;

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const pair = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=${$page.params.slug}&chainID=42161`);
        const jsonPair = await pair.json();

        if (typeof jsonPair.error === `undefined`) {
            valid = true;
            token = jsonPair[0];

            let priceString = ``;
            zeroes = ``;
            price = ``;
            let i = 0;

            const ethPriceReq = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad&chainID=42161`);
            const jsonEthPrice = await ethPriceReq.json();
            typeof jsonEthPrice.error === `undefined` && (ethPrice = jsonEthPrice[0].Token_2_price);

            if (token.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                priceString = parseFloat(token.Token_2_price * ethPrice).toFixed(32).toString();
            } else if (token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                priceString = parseFloat(ethPrice * (token.Token_2_price * token.Token_1_price)).toFixed(32).toString();
            } else {
                const xhr = new XMLHttpRequest();
                xhr.onload = async () => {
                    const json = JSON.parse(xhr.response); // TODO check for errors
                    const pair = json.data.pairs[0];

                    // TODO console.log(pair.token0Price, pair.token1Price, parseFloat(pair.token0Price) * parseFloat(pair.token1Price));
                };
                xhr.onerror = () => {
                    console.log(`Request failed.`);
                };
                /* The Graph has issues, but it'll have to do for now. */
                xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
                xhr.setRequestHeader(`Content-Type`, `application/json`);
                xhr.send(JSON.stringify({
                    query: `{\n  pairs(where: {id: "${$page.params.slug}"}) {\n    token0Price\n    token1Price\n\t}\n}\n`,
                    variables: null,
                }));
            }

            for (let j = 0; j < priceString.length; j++) {
                if (priceString[0] === `0`) {
                    if (!zeroes.includes(`.`)) {
                        zeroes += priceString[j];
                    } else if (priceString[j] === `0` && i === 0) {
                        zeroes += priceString[j];
                    } else if (zeroes.includes(`.`) && i < 4) {
                        price += priceString[j];
                        i++;
                    } else if (i >= 4) {
                        break;
                    }
                } else {
                    price += priceString[j];
                    if (price.includes(`.`) && i < 2) {
                        i++;
                    } else if (i >= 2) {
                        break;
                    }
                }
            }

            const liquidityReq = await fetch(`https://api2.sushipro.io/?action=get_historical_liquidity&pair=${$page.params.slug}&from=${timestamp - 604800}&to=${timestamp}&chainID=42161`);
            const jsonLiquidity = await liquidityReq.json();
            typeof jsonLiquidity.error === `undefined` && (liquidity = jsonLiquidity);

            const volumeReq = await fetch(`https://api2.sushipro.io/?action=get_historical_volume&pair=${$page.params.slug}&from=${timestamp - 604800}&to=${timestamp}&chainID=42161`);
            const jsonVolume = await volumeReq.json();
            typeof jsonVolume.error === `undefined` && (volume = jsonVolume);
            try {
                volume24 = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(volume[1][volume[1].length - 2].USD_total_volume);
            } catch (e) {
                volume24 = `Error calculating volume`;
            }

            // TODO console.log(liquidity, volume);

            const xhr = new XMLHttpRequest();
            xhr.onload = async () => {
                const json = JSON.parse(xhr.response); // TODO check for errors
                const pair = json.data.pairs[0];
                supply = pair.totalSupply;
                txCount = pair.txCount;
                swaps = pair.swaps.sort((a, b) => {
                    return a.timestamp - b.timestamp;
                }).reverse();
            };
            xhr.onerror = () => {
                console.log(`Request failed.`);
            };
            /* The Graph has issues, but it'll have to do for now. */
            xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
            xhr.setRequestHeader(`Content-Type`, `application/json`);
            xhr.send(JSON.stringify({
                query: `{\n  pairs(where: {id: "${$page.params.slug}"}) {\n    totalSupply\n    txCount\n    reserveETH\n    reserveUSD\n    swaps {\n        timestamp\n        amount0In\n        amount1In\n        amount0Out\n        amount1Out\n        transaction {\n            id\n        }\n    }\n\t}\n}\n`,
                variables: null
            }));
        } else {
            goto(`/charts/`);
        }

        loading = false;
    };

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
                <p class="subtitle">
                    <span class="bold">{token.Token_1_name} / {token.Token_2_name}</span>
                    &nbsp;
                    (<a href="https://arbiscan.io/token/{$page.params.slug}" rel="external noopener" target="_blank">{$page.params.slug}</a> <Copy text={$page.params.slug} />)
                </p>
            </div>
            <Search />
        </div>
        <div class="flex flex--center">
            <div class="left">
                {#if token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1` || token.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`}
                    <h2><span class="light">${zeroes}</span>{price} <span class="light">USDT</span></h2>
                    <p class="light">({token.Token_2_price} {token.Token_2_symbol})</p>
                {:else}
                    <h2>1 {token.Token_1_symbol} = {token.Token_2_price} {token.Token_2_symbol}</h2>
                    <p class="light"><em>USDT pricing is coming soon for non-WETH pairs!</em></p>
                {/if}
            </div>
            <div class="right">
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_1_contract}" rel="external noopener" target="_blank" draggable="false">Buy {token.Token_1_symbol}</a>
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_2_contract}" rel="external noopener" target="_blank" draggable="false">Buy {token.Token_2_symbol}</a>
            </div>
        </div>
        <div class="details">
            <p class="flex"><span class="bold">Exchange</span><span>Sushiswap</span></p>
            <p class="flex"><span class="bold">24H Volume (USDT)</span><span>{!!volume ? volume24 : 0}</span></p>
            <p class="flex"><span class="bold">Market Cap (Fully Diluted)</span><span><em>Coming soon!</em></span></p>
        </div>

        <Chart id="0" pairAddress={$page.params.slug} tokenOneAddress={token.Token_1_contract} tokenTwoAddress={token.Token_2_contract} tokenOnePrice={token.Token_1_price} tokenTwoPrice={token.Token_2_price} tokenOneSymbol={token.Token_1_symbol} tokenTwoSymbol={token.Token_2_symbol} {ethPrice} />
        <p><strong>Some charts may be a bit buggy at the moment. These issues are being fixed as we speak. Thanks for your patience!!</strong></p>

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
        {#if !!swaps}
            {#if swaps.length > 0}
                <p>Showing the 100 most recent trades.</p>
                <p><em>This doesn't yet update in real time, so you'll have to refresh the page to fetch new trades.</em></p>
                <div class="scroller">
                    <table class="trades">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Type</th>
                                <th>Amount ({token.Token_1_symbol})</th>
                                <th>Est. Price Impact</th>
                                <th>TX Hash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each swaps as swap}
                                <Trade timestamp={swap.timestamp} type={swap.amount0In > 0 ? `Buy` : `Sell`} amount={swap.amount0In > 0 ? swap.amount0In : swap.amount0Out} address={swap.transaction.id} />
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <p><em>There haven't been any transactions for this pair yet.</em></p>
            {/if}
        {:else}
            <p>No transaction data is available for this pair.</p>
        {/if}

        <h2>Info</h2>
        <div class="details">
            <p class="flex"><span class="bold">Website</span><span><em>Coming soon!</em></span></p>
            <p class="flex"><span class="bold">Telegram</span><span><em>Coming soon!</em></span></p>
            <p class="flex"><span class="bold">Discord</span><span><em>Coming soon!</em></span></p>
            <p class="flex"><span class="bold">Twitter</span><span><em>Coming soon!</em></span></p>
            <p class="flex"><span class="bold">GitHub</span><span><em>Coming soon!</em></span></p>
        </div>
        <p><em>Token descriptions are coming soon!</em></p>

        <h2>Other {token.Token_1_name} Pairs</h2>
        <p><em>"Other pairs" coming soon!</em></p>

        <h2>Share</h2>
        <p><em>Share buttons are coming soon!</em></p>
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
    .light {
        color: #888;
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
    .scroller {
        background-color: rgba(207, 181, 146, .2);
        border-radius: 8px;
        max-height: 600px;
        overflow-x: auto;
        padding: 8px;
        scrollbar-width: thin;
        .trades {
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 32px;
            width: 100%;
            thead th {
                text-align: left;
            }
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
        .scroller {
            overflow-x: hidden;
            .trades {
                border-collapse: separate !important;
                border-spacing: 0 1em !important;
            }
        }
    }
</style>

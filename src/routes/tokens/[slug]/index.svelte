<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Loader from '$lib/components/Loader/index.svelte';
    import Copy from '$lib/components/Copy/index.svelte';
    import Search from '$lib/components/Search/index.svelte';
    //import Chart from '$lib/components/Chart/index.svelte';
    import SimpleChart from '$lib/components/Chart/SimpleChart.svelte';
    import Arbigator from '$lib/components/Arbigator/index.svelte';
    import Trade from '$lib/components/Trade/index.svelte';
    import ripple from '$lib/services/ripple';

    let loading = true;
    let valid = false;
    let ethPrice = -1;

    let pair = [];
    let token = null;
    let liquidity = null;
    let volume = null;

    let symbol = ``;
    let decimalsBase = 18;
    let decimalsQuote = 18;
    let zeroes = ``;
    let price = ``;
    let change = ``;
    let changePctg = ``;
    let changeDir = `positive`;
    let volume24 = ``;

    let supply = 0;
    let fdmc = 0;
    let txCount = 0;
    let holders = 0;
    let swaps = [];

    let Token_1_name = `--------`;
    let Token_2_name = `--------`;
    let Token_1_symbol = `----`;
    let Token_2_symbol = `----`;
    let Pair_ID = `0x000000000000000000000000000000000000`;
    let Token_1_contract = `0x000000000000000000000000000000000000`;
    let Token_2_contract = `0x000000000000000000000000000000000000`;
    let Token_1_price = `0.00`;
    let Token_2_price = `0.00`;

    let liquidityUSDT = -1;

    let doc;

    const addToken = async (e) => {
        !!doc && (ripple(e, doc));
        if (typeof document !== `undefined`) {
            await window.ethereum.request({
                method: `wallet_watchAsset`,
                params: {
                    options: {
                        address: $page.params.slug,
                        decimals: decimalsBase,
                        symbol,
                    },
                    type: `ERC20`,
                },
            });
        }
    };

    const refresh = async () => {
        loading = true;

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const tokenPairs = await fetch(`https://api2.sushipro.io/?action=get_pairs_by_token&token=${$page.params.slug}&chainID=42161`);
        const jsonTokenPairs = await tokenPairs.json();

        if (typeof jsonTokenPairs.error === `undefined`) {
            valid = true;
            //token = jsonPair[0];

            let found = false;
            let priceString = ``;
            symbol = ``;
            zeroes = ``;
            price = ``;
            let i = 0;

            const ethPriceReq = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad&chainID=42161`);
            const jsonEthPrice = await ethPriceReq.json();
            typeof jsonEthPrice.error === `undefined` && (ethPrice = jsonEthPrice[0].Token_2_price);

            try {
                jsonTokenPairs[1].forEach((p) => {
                    if (found === false) {
                        if (p.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                            symbol = p.Token_1_symbol;
                            priceString = parseFloat(p.Token_2_price * ethPrice).toFixed(32).toString();
                            token = p;
                            Token_1_name = token.Token_1_name;
                            Token_2_name = token.Token_2_name;
                            Token_1_symbol = token.Token_1_symbol;
                            Token_2_symbol = token.Token_2_symbol;
                            Pair_ID = token.Pair_ID;
                            Token_1_contract = token.Token_1_contract;
                            Token_2_contract = token.Token_2_contract;
                            Token_1_price = token.Token_1_price;
                            Token_2_price = token.Token_2_price;
                            pair = p.Pair_ID;
                            found = true;
                        } else if (p.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                            symbol = p.Token_2_symbol;
                            priceString = parseFloat(ethPrice * p.Token_1_price).toFixed(32).toString();
                            token = p;
                            Token_1_name = token.Token_1_name;
                            Token_2_name = token.Token_2_name;
                            Token_1_symbol = token.Token_1_symbol;
                            Token_2_symbol = token.Token_2_symbol;
                            Pair_ID = token.Pair_ID;
                            Token_1_contract = token.Token_1_contract;
                            Token_2_contract = token.Token_2_contract;
                            Token_1_price = token.Token_1_price;
                            Token_2_price = token.Token_2_price;
                            pair = p.Pair_ID;
                            found = true;
                        }
                        if (!!token && typeof document !== `undefined`) document.title = `$${p.Token_1_symbol} / $${p.Token_2_symbol} Live Arbitrum Charts & Analytics - Arbucks`;
                    }
                });
            } catch (e) {
                goto(`/tokens/`);
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

            /*
            TODO
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
            */

            /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
            try {
                const COVALENT_KEY = `ckey_f02916bdd2b04038bc0808fb3bc`;
                const holdersReq = await fetch(`https://api.covalenthq.com/v1/42161/tokens/${$page.params.slug}/token_holders/?key=${COVALENT_KEY}`);
                const jsonHolders = await holdersReq.json();
                decimalsBase = jsonHolders.data.items[0].contract_decimals;
                fdmc = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(parseFloat(priceString) * (jsonHolders.data.items[0].total_supply / (10 ** decimalsBase)));
                holders = jsonHolders.data.pagination.total_count;
            } catch (e) {
                fdmc = `Error`;
                holders = `Error`;
            }

            const xhr = new XMLHttpRequest();
            xhr.onload = async () => {
                const json = JSON.parse(xhr.response); // TODO check for errors
                const pair = json.data.pairs[0]; // TODO rename this
                txCount = pair.txCount;
                volume = true;
                volume24 = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.volumeUSD);
                /*
                swaps = pair.swaps.sort((a, b) => {
                    return a.timestamp - b.timestamp;
                }).reverse();
                */
                try {
                    let reserveBasedPrice = pair.dayData[1].reserve1 / pair.dayData[1].reserve0;
                    if (token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        reserveBasedPrice = pair.dayData[1].reserve0 / pair.dayData[1].reserve1;
                    }
                    change = parseFloat(priceString) - (parseFloat(reserveBasedPrice * ethPrice).toFixed(32).toString());
                    changePctg = ((change / parseFloat(priceString)) * 100).toFixed(2);
                    changeDir = change >= 0 ? `positive` : `negative`;
                    if (token.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        liquidityUSDT = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.token0.liquidity * parseFloat(priceString) * 2);
                    } else if (token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        liquidityUSDT = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.token1.liquidity * parseFloat(priceString) * 2);
                    }
                } catch (e) {
                    try {
                        let reserveBasedPrice = pair.dayData[0].reserve1 / pair.dayData[0].reserve0;
                        if (token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                            reserveBasedPrice = pair.dayData[0].reserve0 / pair.dayData[0].reserve1;
                        }
                        change = parseFloat(priceString) - (parseFloat(reserveBasedPrice * ethPrice).toFixed(32).toString());
                        changePctg = ((change / parseFloat(priceString)) * 100).toFixed(2);
                        changeDir = change >= 0 ? `positive` : `negative`;
                    } catch(e) {
                        change = `Error`;
                        changePctg = ``;
                        changeDir = `negative`;
                    }
                }
            };
            xhr.onerror = () => {
                console.log(`Request failed.`);
            };
            /* The Graph has issues, but it'll have to do for now. */
            xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
            xhr.setRequestHeader(`Content-Type`, `application/json`);
            xhr.send(JSON.stringify({
                query: `{\n  pairs(where: {id: "${pair}"}) {\n    token0 {\n      liquidity    }\n    token1 {\n      liquidity    }\n    totalSupply\n    txCount\n    reserveETH\n    reserveUSD\n    volumeUSD\n    dayData(orderBy: date, orderDirection: desc) {\n      date\n      reserve0\n      reserve1\n    }\n    swaps {\n        timestamp\n        to\n        amountUSD\n        amount0In\n        amount1In\n        amount0Out\n        amount1Out\n        transaction {\n            id\n        }\n    }\n\t}\n}\n`,
                variables: null,
            }));
            const txReq = await fetch(`https://api2.sushipro.io/?action=get_transactions_by_pair&pair=${pair}&chainID=42161`);
            const txJson = await txReq.json();
            if (typeof txJson.error === `undefined`) {
                swaps = txJson[1];
            }
        } else {
            goto(`/tokens/`);
        }

        loading = false;
    };

    onMount(() => doc = document);

    $: $page.params.slug, (typeof XMLHttpRequest !== `undefined`) && (refresh());
</script>

<svelte:head>
    <title>Live Arbitrum Charts & Analytics - Arbucks</title>
    <link rel="canonical" href="/tokens/{$page.params.slug}/">
    <meta property="og:title" content="Live Arbitrum Charts & Analytics - Arbucks">
    <meta name=twitter:title content="Live Arbitrum Charts & Analytics - Arbucks">
</svelte:head>

<div class="flex flex--top">
    <div class="flex flex--header">
        <img class="image" src="/placeholder.png" aria-hidden="true">
        <div>
            <h1 class="title">{Token_1_symbol} / {Token_2_symbol}</h1>
            <p class="subtitle">
                <span class="bold">{Token_1_name} / {Token_2_name}</span>
                &nbsp;
                (<a href="https://arbiscan.io/token/{$page.params.slug}" rel="external noopener" target="_blank">{$page.params.slug}</a> <Copy text={$page.params.slug} />)
            </p>
        </div>
    </div>
    <Search />
</div>
<div class="flex flex--center flex--mobile">
    <div class="left">
        <h2><span class="light">${zeroes}</span><span class="price">{price}</span> <span class="light">USDT</span> <span class={changeDir}>{changePctg}%</span></h2>
        <br>
        <!--<p class="light">(TODO ETH)</p>-->
        <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={Token_1_contract}" rel="external noopener" target="_blank" draggable="false">Buy {Token_1_symbol}</a>
        <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={Token_2_contract}" rel="external noopener" target="_blank" draggable="false">Buy {Token_2_symbol}</a>
    </div>
</div>

<div class="details details--mobile">
    <p class="flex"><span class="bold">Exchange</span><span>Sushiswap V2</span></p>
    <p class="flex"><span class="bold">24H Volume</span><span>{!!volume ? volume24 : 0}</span></p>
    <p class="flex"><span class="bold">Market Cap</span><span>{fdmc}</span></p>
    <p class="flex"><span class="bold">Holders</span><span>{holders}</span></p>
    <p class="flex"><span class="bold">Transactions</span><span>{txCount}</span></p>
</div>

<div class="details details--desktop">
    <div>
        <p class="details__price"><span class="light">${zeroes}</span><span class="price">{price}</span> <span class="light">USDT</span> <span class={changeDir}>{changePctg}%</span></p>
        <p class="details__detail"><span class="bold">Exchange</span><span>Sushiswap V2</span></p>
        <p class="details__detail"><span class="bold">24H Volume</span><span>{!!volume ? volume24 : 0}</span></p>
        <p class="details__detail"><span class="bold">Market Cap</span><span>{fdmc}</span></p>
        <p class="details__detail"><span class="bold">Liquidity</span><span>~{liquidityUSDT}</span></p>
        <p class="details__detail"><span class="bold">Holders</span><span>{holders}</span></p>
        <p class="details__detail"><span class="bold">Transactions</span><span>{txCount}</span></p>
    </div>
    <div>
        <button class="squareButton" on:click={addToken} on:mousedown={(e) => !!doc && (ripple(e, doc))}>
            <img height="28px" width="28px" draggable="false" src="https://cloudflare-ipfs.com/ipfs/QmWZk7iimf2AN8Rc9DRHvJUdwuqsqTL5TVwNdZuLWfDNgf" alt="MetaMask logo" loading="lazy"><span>+</span>
        </button>
    </div>
</div>

<div class="flex flex--center flex--main">
    <div class="trades__mobile">
        {#if !!swaps}
            {#if swaps.length > 0}
                <div class="scroller scroller--dark">
                    <table class="trades trades--desktop">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <!--
                                <th>Type</th>
                                -->
                                <th>Amount (USDT)</th>
                                <!--
                                <th>Est. Price Impact (WIP)</th>
                                -->
                                <th>Maker</th>
                                <th>TX</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each swaps as swap}
                                <Trade timestamp={swap.timestamp} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} type={`${swap.side.toLowerCase().charAt(0)}${swap.side.toLowerCase().slice(1)}`} amount={swap.volumeUSD} maker={swap.receiver} address={swap.txHash} version="desktop" />
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        {/if}
    </div>
    {#if !!token && loading === false}
        <SimpleChart id="0" pairAddress={Pair_ID} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} tokenOnePrice={Token_1_price} tokenTwoPrice={Token_2_price} tokenOneSymbol={Token_1_symbol} tokenTwoSymbol={Token_2_symbol} {ethPrice} />
    {:else}
        <div class="loading">
            <Loader />
        </div>
    {/if}
    <!--
    <Chart id="0" pairAddress={Pair_ID} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} tokenOnePrice={Token_1_price} tokenTwoPrice={Token_2_price} tokenOneSymbol={Token_1_symbol} tokenTwoSymbol={Token_2_symbol} {ethPrice} />
    -->
    <!--
    <iframe class="trade" src="https://app.sushi.com/swap?inputCurrency={Token_1_contract}&outputCurrency={Token_2_contract}" title="Trade on Sushiswap"></iframe>
    -->
    <Arbigator tokenOneSymbol={symbol} tokenTwoSymbol={Token_1_symbol === symbol ? Token_2_symbol : Token_1_symbol} pairAddress={Pair_ID} pairLiquidity={liquidityUSDT} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} tokenOneDecimals={decimalsBase} tokenTwoDecimals={decimalsQuote} />
</div>

<br>

<!--
    TODO
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
-->

<div class="trades__mobile">
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
                            <!--
                            <th>Type</th>
                            -->
                            <th>Amount (USDT)</th>
                            <!--
                            <th>Est. Price Impact (WIP)</th>
                            -->
                            <th>Maker</th>
                            <th>TX Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each swaps as swap}
                            <Trade timestamp={swap.timestamp} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} type={`${swap.side.toLowerCase().charAt(0)}${swap.side.toLowerCase().slice(1)}`} amount={swap.volumeUSD} maker={swap.receiver} address={swap.txHash} version="mobile" />
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
</div>

<h2>Info</h2>
<div class="details">
    <p class="flex"><span class="bold">Website</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">Telegram</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">Discord</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">Twitter</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">GitHub</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">4chan</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">Reddit</span><span><em>Coming soon!</em></span></p>
    <p class="flex"><span class="bold">TikTok</span><span><em>Coming soon!</em></span></p>
</div>
<p><em>Token descriptions are coming soon!</em></p>

<h2>Other {Token_1_name} Pairs</h2>
<p><em>"Other pairs" coming soon!</em></p>

<h2>Share</h2>
<p><em>Share buttons are coming soon!</em></p>

<style>
    .loading {
        align-items: center;
        display: flex;
        margin-top: 20px;
        justify-content: center;
    }
    .image {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
        height: 64px;
        margin-right: 8px;
        width: 64px;
    }
    .title {
        font-size: 24px;
        margin: 0 0 8px;
    }
    .subtitle {
        color: var(--fg-subtitle);
        font-size: 14px;
    }
    .bold {
        font-weight: 700;
    }
    .flex {
        display: block;
        margin: 24px 0;
        .left, .right {
            margin-bottom: 24px;
        }
        &.flex--top {
            margin-bottom: 0;
            p {
                margin-bottom: 0;
            }
        }
        &.flex--header {
            align-items: center;
        }
        &.flex--main {
            > *:first-child {
                display: none;
            }
        }
    }
    .light {
        color: #888;
    }
    .price {
        color: #f8f8f8;
    }
    .positive {
        color: #00f000;
    }
    .negative {
        color: #ff6e6e;
    }
    .details {
        border: 1px solid var(--fg-border);
        border-width: 1px 0 1px 0;
        width: 100%;
        p.flex {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
        }
        &.details--desktop {
            display: none;
        }
    }
    p {
        font-size: 14px;
    }
    h2 {
        font-size: 20px;
    }
    .squareButton {
        align-items: center;
        background-color: var(--bg-row);
        border: 0;
        border-radius: 8px;
        color: var(--fg-title);
        column-gap: 4px;
        cursor: pointer;
        display: flex;
        font-size: 18px;
        height: 38px;
        justify-content: space-between;
        margin-top: 14px;
        outline: 0;
        overflow: hidden;
        padding: 0 8px;
        position: relative;
        &:hover {
            opacity: .8;
        }
    }
    .scroller {
        background-color: var(--bg-table);
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
                &:last-child {
                    text-align: center;
                }
            }
            &.trades--small {
                font-size: 12px;
                width: 100%;
            }
            &.trades--desktop {
                font-size: 8px;
            }
        }
    }
    @media screen and (min-width: 1024px) {
        .flex {
            display: flex;
            justify-content: space-between;
            .left, .right {
                width: 100%;
            }
            .left {
                h2 {
                    margin: 0;
                }
                p {
                    margin-bottom: 22px;
                }
                a:last-child {
                    margin-left: 4px;
                }
            }
            &.flex--center {
                align-items: center;
            }
            &.flex--mobile {
                display: none;
            }
            &.flex--main {
                align-items: flex-start;
                > * {
                    &:first-child {
                        display: block;
                        max-width: 300px;
                        width: 100%;
                    }
                }
            }
        }
        .details.details--mobile {
            display: none;
        }
        .details.details--desktop {
            align-items: center;
            border: 0;
            display: flex;
            justify-content: space-between;
            > div:first-child {
                align-items: center;
                display: flex;
                column-gap: 24px;
                width: 100%;
                .details__price {
                    font-size: 20px;
                    margin-bottom: 0;
                }
                .details__detail {
                    margin-bottom: 0;
                    span:first-child {
                        display: flex;
                        font-size: 12px;
                        flex-direction: column;
                        margin-bottom: 8px;
                        opacity: .75;
                    }
                }
            }
        }
        .trades__mobile {
            display: none;
        }
        .scroller--dark {
            background-color: #000;
            border-radius: 8px 0 0 8px;
            overflow-x: hidden;
            padding: 0;
        }
    }
    :global {
        @media screen and (min-width: 1024px) {
            .scroller--dark tbody tr {
                background-color: #111 !important;
                &:hover {
                    background-color: #222 !important;
                }
            }
        }
    }
</style>

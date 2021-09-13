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

    let pair = [];
    let token = null;
    let liquidity = null;
    let volume = null;

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
                            priceString = parseFloat(p.Token_2_price * ethPrice).toFixed(32).toString();
                            token = p;
                            pair = p.Pair_ID;
                            found = true;
                        } else if (p.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                            priceString = parseFloat(ethPrice * p.Token_1_price).toFixed(32).toString();
                            token = p;
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
            &/

            /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
            try {
                const COVALENT_KEY = `ckey_f02916bdd2b04038bc0808fb3bc`;
                const holdersReq = await fetch(`https://api.covalenthq.com/v1/42161/tokens/${$page.params.slug}/token_holders/?key=${COVALENT_KEY}`);
                const jsonHolders = await holdersReq.json();
                fdmc = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(parseFloat(priceString) * (jsonHolders.data.items[0].total_supply / (10 ** jsonHolders.data.items[0].contract_decimals)));
                holders = jsonHolders.data.pagination.total_count;
            } catch (e) {
                fdmc = `Error`;
                holders = `Error`;
            }

            const xhr = new XMLHttpRequest();
            xhr.onload = async () => {
                const json = JSON.parse(xhr.response); // TODO check for errors
                const pair = json.data.pairs[0];
                txCount = pair.txCount
                volume = true;
                volume24 = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.volumeUSD);
                swaps = pair.swaps.sort((a, b) => {
                    return a.timestamp - b.timestamp;
                }).reverse();
                try {
                    let reserveBasedPrice = pair.dayData[1].reserve1 / pair.dayData[1].reserve0;
                    if (token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        reserveBasedPrice = pair.dayData[1].reserve0 / pair.dayData[1].reserve1;
                    }
                    change = parseFloat(priceString) - (parseFloat(reserveBasedPrice * ethPrice).toFixed(32).toString());
                    changePctg = ((change / parseFloat(priceString)) * 100).toFixed(2);
                    changeDir = change >= 0 ? `positive` : `negative`;
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
                query: `{\n  pairs(where: {id: "${pair}"}) {\n    totalSupply\n    txCount\n    reserveETH\n    reserveUSD\n    volumeUSD\n    dayData(orderBy: date, orderDirection: desc) {\n      date\n      reserve0\n      reserve1\n    }\n    swaps {\n        timestamp\n        amountUSD\n        amount0In\n        amount1In\n        amount0Out\n        amount1Out\n        transaction {\n            id\n        }\n    }\n\t}\n}\n`,
                variables: null,
            }));
        } else {
            goto(`/tokens/`);
        }

        loading = false;
    };

    $: $page.params.slug, refresh();
</script>

<svelte:head>
    <title>Live Arbitrum Charts & Analytics - Arbucks</title>
    <link rel="canonical" href="/tokens/{$page.params.slug}/">
</svelte:head>

{#if !!loading}
    <div class="loading">
        <Moon size="60" color="var(--fg-loader)" unit="px" duration="1s" />
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
                <h2><span class="light">${zeroes}</span><span class="price">{price}</span> <span class="light">USDT</span> <span class={changeDir}>{changePctg}%</span></h2>
                <br>
                <!--<p class="light">(TODO ETH)</p>-->
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_1_contract}" rel="external noopener" target="_blank" draggable="false">Buy {token.Token_1_symbol}</a>
                <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={token.Token_2_contract}" rel="external noopener" target="_blank" draggable="false">Buy {token.Token_2_symbol}</a>
            </div>
            <div class="right">
                <div class="details">
                    <p class="flex"><span class="bold">Exchange</span><span>Sushiswap</span></p>
                    <p class="flex"><span class="bold">24H Volume (USDT)</span><span>{!!volume ? volume24 : 0}</span></p>
                    <p class="flex"><span class="bold">Market Cap (Fully Diluted)</span><span>{fdmc}</span></p>
                    <p class="flex"><span class="bold">Holders</span><span>{holders}</span></p>
                    <p class="flex"><span class="bold">Transactions</span><span>{txCount}</span></p>
                </div>
            </div>
        </div>

        <Chart id="0" pairAddress={token.Pair_ID} tokenOneAddress={token.Token_1_contract} tokenTwoAddress={token.Token_2_contract} tokenOnePrice={token.Token_1_price} tokenTwoPrice={token.Token_2_price} tokenOneSymbol={token.Token_1_symbol} tokenTwoSymbol={token.Token_2_symbol} {ethPrice} />

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
                                <th>Amount (USDT)</th>
                                <th>Est. Price Impact</th>
                                <th>TX Hash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each swaps as swap}
                                <Trade timestamp={swap.timestamp} type={swap.amount0In > 0 ? `Buy` : `Sell`} amount={swap.amountUSD} address={swap.transaction.id} />
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
            <p class="flex"><span class="bold">4chan</span><span><em>Coming soon!</em></span></p>
            <p class="flex"><span class="bold">Reddit</span><span><em>Coming soon!</em></span></p>
            <p class="flex"><span class="bold">TikTok</span><span><em>Coming soon!</em></span></p>
        </div>
        <p><em>Token descriptions are coming soon!</em></p>

        <h2>Other {token.Token_1_name} Pairs</h2>
        <p><em>"Other pairs" coming soon!</em></p>

        <h2>Share</h2>
        <p><em>Share buttons are coming soon!</em></p>
    {:else if token === null && valid === false}
        <h1>Invalid Token</h1>

        <p><em>Redirecting...</em></p>
    {:else}
        <h1>No Pairs Found</h1>

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
        font-size: 24px;
        margin-bottom: 8px;
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
    .flex {
        .left, .right {
            margin-bottom: 24px;
        }
    } 
    .details {
        border: 1px solid var(--fg-border);
        border-width: 1px 0 1px 0;
        width: 100%;
        p.flex {
            margin: 12px 0;
        }
    }
    p {
        font-size: 14px;
    }
    h2 {
        font-size: 20px;
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
            }
        }
    }
    @media screen and (min-width: 768px) {
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

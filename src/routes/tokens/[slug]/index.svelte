<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Loader from '$lib/components/Loader/index.svelte';
    import Copy from '$lib/components/Copy/index.svelte';
    import Search from '$lib/components/Search/index.svelte';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Trade from '$lib/components/Trade/index.svelte';
    //import LiquidityEvent from '$lib/components/LiquidityEvent/index.svelte';
    import TVChart from '$lib/components/Chart/index.svelte';
    import Arbigator from '$lib/components/Arbigator/index.svelte';
    import SegmentedButton, { Segment, Icon } from '@smui/segmented-button';
    import Wrapper from '@smui/touch-target';
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
    let volumeAll = ``;
    let volume168 = ``;
    let volume24 = ``;

    let supply = 0;
    let fdmc = 0;
    let txCount = 0;
    let holders = 0;
    let holderList = [];
    let swaps = [];
    let liquidityEvents = []; // TODO
    let pairs = [];

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
    let chart;

    let active = `trades`;
    let tab = `trades`;

    let activeMobile = `trades`;
    let tabMobile = `trades`;

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

    const autoRefresh = async () => {
        const tokenPairs = await fetch(`https://api2.sushipro.io/?action=get_pairs_by_token&token=${$page.params.slug}&chainID=42161`);
        const jsonTokenPairs = await tokenPairs.json();

        if (typeof jsonTokenPairs.error === `undefined`) {
            let priceString = ``;
            let newZeroes = ``;
            let newPrice = ``;
            let i = 0;

            const ethPriceReq = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad&chainID=42161`);
            const jsonEthPrice = await ethPriceReq.json();
            typeof jsonEthPrice.error === `undefined` && (ethPrice = jsonEthPrice[0].Token_2_price);

            try {
                jsonTokenPairs[1].forEach((p) => {
                    if (p.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) priceString = parseFloat(p.Token_2_price * ethPrice).toFixed(32).toString();
                    else if (p.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) priceString = parseFloat(ethPrice * p.Token_1_price).toFixed(32).toString();
                });
            } catch (e) {}

            for (let j = 0; j < priceString.length; j++) {
                if (priceString[0] === `0`) {
                    if (!newZeroes.includes(`.`)) {
                        newZeroes += priceString[j];
                    } else if (priceString[j] === `0` && i === 0) {
                        newZeroes += priceString[j];
                    } else if (newZeroes.includes(`.`) && i < 4) {
                        newPrice += priceString[j];
                        i++;
                    } else if (i >= 4) {
                        break;
                    }
                } else {
                    newPrice += priceString[j];
                    if (newPrice.includes(`.`) && i < 2) i++;
                    else if (i >= 2) break;
                }
            }
            zeroes = newZeroes;
            price = newPrice;
        }

        const txReq = await fetch(`https://api2.sushipro.io/?action=get_transactions_by_pair&pair=${Pair_ID}&chainID=42161`);
        const txJson = await txReq.json();
        if (typeof txJson.error === `undefined`) {
            swaps[0] !== txJson[1][0] && (swaps = txJson[1]);
            //swaps = txJson[1];
        }
    };

    const refresh = async () => {
        loading = true;

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const tokenPairs = await fetch(`https://api2.sushipro.io/?action=get_pairs_by_token&token=${$page.params.slug}&chainID=42161`);
        const jsonTokenPairs = await tokenPairs.json();

        if (typeof jsonTokenPairs.error === `undefined`) {
            pairs = jsonTokenPairs[1];
            valid = true;

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
                        if (!!token && typeof document !== `undefined`) document.title = `$${zeroes}${price} - $${symbol} Live Arbitrum Charts & Analytics - Arbucks`;
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

            const volume168Req = await fetch(`https://api2.sushipro.io/?action=get_historical_volume&pair=${pairs[0].Pair_ID}&from=${timestamp - 604800}&to=${timestamp}&chainID=42161`);
            const json168Volume = await volume168Req.json();
            typeof json168Volume.error === `undefined` && (volume = json168Volume);
            try {
                let tempVolume = 0;
                volume[1].forEach((vol) => tempVolume += vol.USD_total_volume);
                volume168 = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(tempVolume);
            } catch (e) {
                volume168 = `Error calculating volume`;
            }

            const volume24Req = await fetch(`https://api2.sushipro.io/?action=get_historical_volume&pair=${pairs[0].Pair_ID}&from=${timestamp - (86400 * 2)}&to=${timestamp}&chainID=42161`);
            const json24Volume = await volume24Req.json();
            typeof json24Volume.error === `undefined` && (volume = json24Volume);
            try {
                let tempVolume = 0;
                volume[1].forEach((vol) => tempVolume += vol.USD_total_volume);
                volume24 = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(tempVolume);
            } catch (e) {
                volume24 = `Error calculating volume`;
            }

            /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
            try {
                const COVALENT_KEY = `ckey_f02916bdd2b04038bc0808fb3bc`;
                const holdersReq = await fetch(`https://api.covalenthq.com/v1/42161/tokens/${$page.params.slug}/token_holders/?key=${COVALENT_KEY}`);
                const jsonHolders = await holdersReq.json();
                decimalsBase = jsonHolders.data.items[0].contract_decimals;
                supply = jsonHolders.data.items[0].total_supply / (10 ** decimalsBase);
                fdmc = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(parseFloat(priceString) * (supply));
                holders = jsonHolders.data.pagination.total_count;
                holderList = jsonHolders.data.items;
            } catch (e) {
                fdmc = `Error`;
                holders = `Error`;
                holderList = [];
            }

            const xhr = new XMLHttpRequest();
            xhr.onload = async () => {
                const json = JSON.parse(xhr.response); // TODO check for errors
                const pair = json.data.pairs[0]; // TODO rename this
                txCount = pair.txCount;
                volume = true;
                volumeAll = new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.volumeUSD);
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

    const randomRGBA = () => {
        const o = Math.round, r = Math.random, s = 255;
        const inner = `${(r()*s)},${o(r()*s)},${o(r()*s)}`;
        return {
            backgroundColor: `rgba(${inner},.2)`,
            borderColor: `rgba(${inner},1)`,
        };
    };

    let chartRendered = false;

    const updateHolders = () => {
        if (chartRendered === false && holderList.length > 0 && holders > 0) {
            let backgroundColor = [];
            let borderColor = [];
            for (let i = 0; i < (holderList.length > 99 ? 101 : holderList.length); i++) {
                const rgba = randomRGBA();
                backgroundColor.push(rgba.backgroundColor);
                borderColor.push(rgba.borderColor);
            }
            let balance = supply;
            let data = [];
            holderList.forEach((holder) => {
                data.push(holder.balance / (10 ** holder.contract_decimals))
                balance -= holder.balance / (10 ** holder.contract_decimals);
            });
            if (holders > 100) {
                data.push(supply - balance);
                let labels = [];
                holderList.forEach((holder) => labels.push(holder.address));
                labels.push(`Other`);
            }
            const holderChart = new chart(doc.getElementById(`holderChart`).getContext(`2d`), {
                data: {
                    datasets: [
                        {
                            backgroundColor,
                            borderColor,
                            borderWidth: 1,
                            data,
                            label: `BUCK tokens`,
                        }
                    ],
                },
                options: {},
                type: `pie`,
            });
            chartRendered = true;
        }
    };

    onMount(async () => {
        doc = document;
        await import(`https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js`);
        chart = Chart;
        setInterval(() => autoRefresh(), 10000);
    });

    $: $page.params.slug, (typeof XMLHttpRequest !== `undefined`) && (refresh());
    $: holderList, (!!doc && !!chart) && (updateHolders());
</script>

<svelte:head>
    <title>${zeroes}{price} - ${symbol} Live Arbitrum Charts & Analytics - Arbucks</title>
    <link rel="canonical" href="/tokens/{$page.params.slug}/">
    <meta property="og:title" content="Live Arbitrum Charts & Analytics - Arbucks">
    <meta name=twitter:title content="Live Arbitrum Charts & Analytics - Arbucks">
</svelte:head>

<div class="flex flex--top">
    <div class="flex flex--header">
        {#if $page.params.slug === `0xafd871f684f21ab9d7137608c71808f83d75e6fc`}
            <img class="image" src="/img/arbucks-logo.png" loading="lazy" aria-hidden="true">
        {:else}
            <img class="image" src="/placeholder.png" loading="lazy" aria-hidden="true">
        {/if}
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
        <!--<p class="light">(TODO ETH)</p>-->
    </div>
</div>

<div class="details details--mobile">
    <p class="flex"><span class="bold">Exchange</span><span>Sushiswap V2</span></p>
    <p class="flex"><span class="bold">24H Volume</span><span>~{!!volume ? volume24 : 0}</span></p>
    <p class="flex"><span class="bold">Market Cap</span><span>{fdmc}</span></p>
    <p class="flex"><span class="bold">Holders</span><span>{new Intl.NumberFormat(`en-US`, {}).format(holders)}</span></p>
    <p class="flex"><span class="bold">Transactions</span><span>{new Intl.NumberFormat(`en-US`, {}).format(txCount)}</span></p>
</div>

<div class="details details--desktop">
    <div>
        <p class="details__price"><span class="light">${zeroes}</span><span class="price">{price}</span> <span class="light">USDT</span> <span class={changeDir}>{changePctg}%</span></p>
        <p class="details__detail"><span class="bold">Exchange</span><span>Sushiswap V2</span></p>
        <p class="details__detail"><span class="bold">24H Volume</span><span>~{!!volume ? volume24 : 0}</span></p>
        <p class="details__detail"><span class="bold">Market Cap</span><span>{fdmc}</span></p>
        <p class="details__detail"><span class="bold">Liquidity</span><span>~{liquidityUSDT}</span></p>
        <p class="details__detail"><span class="bold">Holders</span><span>{new Intl.NumberFormat(`en-US`, {}).format(holders)}</span></p>
        <p class="details__detail"><span class="bold">Transactions</span><span>{new Intl.NumberFormat(`en-US`, {}).format(txCount)}</span></p>
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
                <div class="trades__tabs">
                    <TabBar tabs={[`trades`, `liquidity`]} let:tab bind:active>
                        <Tab {tab}>
                            <Label>{tab}</Label>
                        </Tab>
                    </TabBar>
                </div>
                <div class="scroller scroller--dark">
                    {#if active === `trades`}
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
                                    <Trade timestamp={swap.timestamp} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} type={((swap.side === `BUY` && Token_1_contract !== `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) || (swap.side === `SELL` && Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`)) ? `buy` : `sell`} amount={swap.volumeUSD} maker={swap.receiver} address={swap.txHash} version="desktop" />
                                {/each}
                            </tbody>
                        </table>
                    {:else}
                        <p>This feature is coming soon and will display the recent additions and removals to the token's primary liquidity pool.</p>
                    {/if}
                </div>
            {/if}
        {/if}
    </div>
    {#if !!token && loading === false}
        <TVChart id="0" pairAddress={Pair_ID} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} tokenOnePrice={Token_1_price} tokenTwoPrice={Token_2_price} tokenOneSymbol={Token_1_symbol} tokenTwoSymbol={Token_2_symbol} {ethPrice} />
    {:else}
        <div class="loading">
            <Loader />
        </div>
    {/if}
    <Arbigator tokenOneSymbol={symbol} tokenTwoSymbol={Token_1_symbol === symbol ? Token_2_symbol : Token_1_symbol} pairAddress={Pair_ID} pairLiquidity={liquidityUSDT} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} tokenOneDecimals={decimalsBase} tokenTwoDecimals={decimalsQuote} />
</div>

<br>

<div class="trades__mobile">
    <h2>Order Book</h2>
    <div class="trades__tabs trades__tabs--mobile">
        <TabBar tabs={[`trades`, `liquidity`]} let:tab={tabMobile} bind:active={activeMobile}>
            <Tab tab={tabMobile}>
                <Label>{tabMobile}</Label>
            </Tab>
        </TabBar>
    </div>
    {#if !!swaps}
        {#if swaps.length > 0}
            <div class="scroller">
                {#if activeMobile === `trades`}
                    <table class="trades">
                        <thead>
                            <tr>
                                <th>Time</th>
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
                                <Trade timestamp={swap.timestamp} tokenOneAddress={Token_1_contract} tokenTwoAddress={Token_2_contract} type={((swap.side === `BUY` && Token_1_contract !== `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) || (swap.side === `SELL` && Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`)) ? `buy` : `sell`} amount={swap.volumeUSD} maker={swap.receiver} address={swap.txHash} version="mobile" />
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    <p>This feature is coming soon and will display the recent additions and removals to the token's primary liquidity pool.</p>
                {/if}
            </div>
        {:else}
            <p><em>There haven't been any transactions for this pair yet.</em></p>
        {/if}
    {:else}
        <p>No transaction data is available for this pair.</p>
    {/if}
</div>

<div class="flex flex--asymmetric">
    <div class="card card--1">
        <h2 class="med">Token Info</h2>
        <div class="card__details">
            <p class="card__detail">
                <span>Total Supply</span>
                <span>{new Intl.NumberFormat(`en-US`, {}).format(supply)}</span>
            </p>
            <p class="card__detail">
                <span>Total Volume</span>
                <span>{!!volume ? volumeAll : 0}</span>
            </p>
            <p class="card__detail">
                <span>7D Volume</span>
                <span>~{!!volume ? volume168 : 0}</span>
            </p>
            <p class="card__detail">
                <span>Fully Diluted Market Cap</span>
                <span>{fdmc}</span>
            </p>
            <p class="card__detail">
                <span>DEX Spot Liquidity</span>
                <span>~{liquidityUSDT}</span>
            </p>
            <hr>
            <p class="card__detail">
                <span>Earliest Trade (UTC)</span>
                <span>Coming Soon</span>
            </p>
            <p class="card__detail">
                <span>Last Trade</span>
                <span>Coming Soon</span>
            </p>
            <hr>
            <p class="card__detail">
                <span>Contract Name</span>
                <span>{Token_1_symbol === symbol ? Token_1_name : Token_2_name}</span>
            </p>
            <p class="card__detail">
                <span>Contract Symbol</span>
                <span>{symbol}</span>
            </p>
            <p class="card__detail">
                <span>Contract Decimals</span>
                <span>{Token_1_symbol === symbol ? decimalsBase : decimalsQuote}</span>
            </p>
        </div>
    </div>
    <div class="card card--2 card--big">
        <h2 class="med">Holders</h2>
        <div class="flex flex--gap">
            <div>
                <h3>Wallet Distribution Chart</h3>
                <div class="wrapper">
                    <div class="pieChart">
                        <canvas id="holderChart" width="400px" height="400px" aria-label="Pie chart of top holders" role="img" />
                    </div>
                </div>
            </div>
            <div class="card__details">
                <p class="card__detail">
                    <span>Unique Holders</span>
                    <span>{new Intl.NumberFormat(`en-US`, {}).format(holders)}</span>
                </p>
                <p class="card__detail">
                    <span>Total Transactions</span>
                    <span>{new Intl.NumberFormat(`en-US`, {}).format(txCount)}</span>
                </p>
                <hr>
                <p class="card__detail">
                    <span>Average Holding ({symbol})</span>
                    <span>{new Intl.NumberFormat(`en-US`, {}).format((supply / holders).toFixed(2))}</span>
                </p>
                <p class="card__detail">
                    <span>Average Holding (USDT)</span>
                    <span>${new Intl.NumberFormat(`en-US`, {}).format(((supply / holders) * parseFloat(`${zeroes}${price}`)).toFixed(2))}</span>
                </p>
                <p class="card__detail">
                    <span>Average Holding (%)</span>
                    <span>{(((supply / holders) / supply) * 100).toFixed(6)}%</span>
                </p>
                <p class="card__detail">
                    <span>Average Entry (USDT)</span>
                    <span>Coming Soon</span>
                </p>
                <p class="card__detail">
                    <span>Average Unrealized P&L (%)</span>
                    <span>Coming Soon</span>
                </p>
                <hr>
                <p class="card__detail">
                    <span>Median Holding ({symbol})</span>
                    <span>Coming Soon</span>
                </p>
                <p class="card__detail">
                    <span>Median Holding (USDT)</span>
                    <span>Coming Soon</span>
                </p>
                <p class="card__detail">
                    <span>Median Holding (%)</span>
                    <span>Coming Soon</span>
                </p>
                <p class="card__detail">
                    <span>Median Entry (USDT)</span>
                    <span>Coming Soon</span>
                </p>
                <p class="card__detail">
                    <span>Median Unrealized P&L (%)</span>
                    <span>Coming Soon</span>
                </p>
            </div>
        </div>
    </div>
</div>

<div class="flex flex--asymmetric">
    <div class="card card--3 card--big">
        <h2 class="med">All ${symbol} Pairs</h2>
        <table class="pairs">
            <thead>
                <tr>
                    <th>Exchange</th>
                    <th>Contract</th>
                    <th>Pair</th>
                    <th>Liquidity</th>
                </tr>
            </thead>
            <tbody>
                {#each pairs as pair}
                    <tr>
                        <td>Sushiswap V2</td>
                        <td>
                            <a href="https://analytics-arbitrum.sushi.com/pairs/{pair.Pair_ID}" rel="external noopener" target="_blank">
                                {pair.Pair_ID.substring(0, 6)}...
                            </a>
                            <Copy text={pair.Pair_ID} />
                        </td>
                        <td>{pair.Token_1_symbol} / {pair.Token_2_symbol}</td>
                        <td>
                            {#if pair.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`}
                                ~{new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.Token_1_reserve * parseFloat(`${zeroes}${price}`).toFixed(2) * 2)}
                            {:else if pair.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`}
                                ~{new Intl.NumberFormat(`en-US`, { currency: `USD`, style: `currency`, }).format(pair.Token_2_reserve * parseFloat(`${zeroes}${price}`).toFixed(2) * 2)}
                            {:else}
                                ???
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="card card--4">
        <h2 class="med">Share</h2>
        <div class="card__share">
            <input type="url" value="https://arbucks.io/tokens/{Token_1_symbol === symbol ? Token_1_contract : Token_2_contract}" disabled>
            <Copy text="https://arbucks.io/tokens/{Token_1_symbol === symbol ? Token_1_contract : Token_2_contract}" />
        </div>
    </div>
</div>

<p class="footnote"><em>More info coming soon.</em></p>

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
        text-align: left;
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
        &.flex--gap {
            column-gap: 18px;
        }
        &.flex--mobile {
            display: flex;
            justify-content: center;
        }
    }
    .light {
        color: #888;
    }
    .price {
        color: #f8f8f8;
    }
    .positive {
        color: #02c77a;
    }
    .negative {
        color: #ff3b69;
    }
    .med {
        font-size: 24px;
    }
    .big {
        font-size: 32px;
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
    .card {
        border-radius: 24px;
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-bottom: 40px;
        min-height: 100px;
        padding: 1em;
        h2 {
            text-align: left;
        }
        .pairs {
            border-collapse: collapse;
            border-radius: 24px;
            border-spacing: 0;
            font-size: 10px;
            margin-bottom: 32px;
            width: 100%;
            th, td {
                padding: 12px;
            }
            th {
                text-align: left;
            }
            tr {
                background-image: linear-gradient(to right, #1d1d1d, #222);;
                &:hover {
                    background: var(--bg-hover);
                }
            }
        }
        .card__details {
            background-image: linear-gradient(to right, #1d1d1d, #222);
            border-radius: 24px;
            box-shadow: rgba(0, 0, 0, .02) 0 1px 3px 0, rgba(27, 31, 35, .15) 0 0 0 1px;
            padding: 18px;
            width: 100%;
            .card__detail {
                display: flex;
                flex-direction: column;
                span:first-child {
                    color: #ddd;
                }
            }
        }
        .card__share {
            align-items: center;
            column-gap: 12px;
            display: flex;
            input {
                background-color: #222;
                border: 0;
                border-radius: 12px;
                color: #ddd;
                font-size: 20px;
                padding: 16px;
                width: 100%;
            }
        }
        &.card--1 {
            background-image: linear-gradient(to right, #054159, #056361);
        }
        &.card--2 {
            background-image: linear-gradient(to right, #521e62, #65447d);
        }
        &.card--3 {
            background-image: linear-gradient(to right, #803e1c, #755043);
        }
        &.card--4 {
            background-image: linear-gradient(to right, #0a397e, #05427a);
        }
        &.card--big {
            flex: 2;
        }
    }
    p {
        font-size: 14px;
    }
    h2 {
        font-size: 20px;
    }
    .trades__mobile {
        text-align: center;
        .scroller {
            border-radius: 0 0 8px 8px;
        }
    }
    .trades__tabs {
        background-color: var(--bg-soft);
        border-radius: 8px 0 0 0;
        height: 48px;
        &.trades__tabs--mobile {
            border-radius: 8px 8px 0 0;
        }
    }
    .wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 18px;
    }
    .pieChart {
        height: 280px;
        position: relative;
        width: 280px;
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
        outline: none;
        overflow: hidden;
        padding: 0 8px;
        position: relative;
        &:hover {
            opacity: .8;
        }
    }
    .scroller {
        background-color: var(--bg-soft);
        border-radius: 8px;
        max-height: 652px;
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
    .footnote {
        color: var(--ac-dark);
        font-family: var(--font);
        font-size: 18px;
        margin-top: 48px;
        text-align: center;
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
            &.flex--asymmetric {
                justify-content: flex-start;
                column-gap: 40px;
                flex-wrap: wrap;
                width: 100%;
                margin-bottom: 40px;
            }
        }
        .card {
            margin-bottom: 0;
            .pairs {
                font-size: 18px;
            }
            .card__detail {
                flex-direction: row !important;
                justify-content: space-between !important;
            }
        }
        .wrapper {
            margin-bottom: 0;
        }
        .pieChart {
            height: 450px;
            width: 450px;
        }
        .big {
            font-size: 48px;
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
            background-color: var(--bg-soft);
            border-radius: 8px 0 0 8px;
            overflow-x: hidden;
            padding: 0;
        }
    }
    :global {
        @media screen and (min-width: 1024px) {
            .scroller--dark {
                thead tr {
                    color: #aaa;
                    height: 28px;
                    th {
                        padding: 2px;
                    }
                }
                tbody tr {
                    background-color: var(--bg-soft) !important;
                    color: #eee;
                    &:hover {
                        background-color: var(--bg-hover) !important;
                    }
                }
            }
        }
    }
</style>

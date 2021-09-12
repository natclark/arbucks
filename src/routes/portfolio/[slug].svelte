<script>
    import { page } from '$app/stores';
    import pairs from '$lib/stores/pairs';
    import portfolioTokens from '$lib/stores/portfolioTokens';
    import portfolioFarms from '$lib/stores/portfolioFarms';
    import portfolioPools from '$lib/stores/portfolioPools';
    import portfolioNFTs from '$lib/stores/portfolioNFTs';
    import portfolioLPs from '$lib/stores/portfolioLPs';
    import portfolioFutures from '$lib/stores/portfolioFutures';
    import { goto } from '$app/navigation';
    import { Moon } from 'svelte-loading-spinners';
    import Copy from '$lib/components/Copy/index.svelte';
    //import Chart from '$lib/components/Portfolio/Chart.svelte';
    import Token from '$lib/components/Portfolio/Token.svelte';
    import LP from '$lib/components/Portfolio/LP.svelte';
    //import NFT from '$lib/components/Portfolio/NFT.svelte';
    //import Trade from '$lib/components/Portfolio/Trade.svelte';

    let loading = true;
    let valid = false;
    let ethPrice = -1;
    let netWorth = 0;

    let address = ``;
    let newPairs = [];
    let tokens = [];
    let lps = [];
    let nfts = [];
    let pools = [];
    let farms = [];
    let futures = [];

    let loadingMessages = [
        `Querying the blockchain...`,
        `Feeding the unicorns...`,
        `Taking the buckpill...`,
        `Eating some crayons...`,
        `Microwaving some tendies...`,
        `Staring at the charts...`,
        `Replying to ChainLinkGod's latest thread...`,
        `Scowering Crypto Twitter for alpha...`,
        `Refreshing /biz/...`,
        `Waiting for ETH to flip BTC...`,
        `TOKEN NOT NEEDED!`,
        `Tending to the yield...`,
        `Shilling internet money to strangers...`,
        `Waiting for Offchain Labs to be the next Google...`,
        `Powering the fourth industrial revolution...`
    ];

    const refresh = async () => {
        loading = true;

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const ethPriceReq = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad&chainID=42161`);
        const jsonEthPrice = await ethPriceReq.json();
        typeof jsonEthPrice.error === `undefined` && (ethPrice = jsonEthPrice[0].Token_2_price);

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const reqPairs = await fetch(`https://api2.sushipro.io/?action=all_pairs&chainID=42161`);
        const jsonPairs = await reqPairs.json();
        jsonPairs[1].forEach((pair) => newPairs.indexOf(newPairs.find((e) => e.Pair_ID === pair.Pair_ID)) === -1 && (newPairs.push(pair)));

        pairs.update(() => newPairs);

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const COVALENT_KEY = `ckey_f02916bdd2b04038bc0808fb3bc`;
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const history = await fetch(`https://api.covalenthq.com/v1/42161/address/${$page.params.slug}/portfolio_v2/?key=${COVALENT_KEY}`);
        const jsonHistory = await history.json();

        if (typeof jsonHistory.address !== `undefined`) {
            valid = true;
            address = jsonHistory.address;

            tokens = [];
            lps = [];
            nfts = [];
            pools = [];
            farms = [];
            futures = [];

            const items = jsonHistory.items;
            items.forEach(async (item) => {
                if (item.holdings[0].close.balance !== `0`) {
                    if (item.contract_name === `SushiSwap LP Token`) {
                        const index = $pairs.indexOf($pairs.find((e) => e.Pair_ID === item.contract_address.toLowerCase()));
                        if (index > -1) {
                            lps.push({
                                address: item.contract_address,
                                name: item.contract_name,
                                exchange: `Sushiswap`,
                                decimals: item.contract_decimals,
                                holdings: item.holdings,
                                tokenOneAddress: $pairs[index].Token_1_contract,
                                tokenTwoAddress: $pairs[index].Token_2_contract,
                                tokenOneName: $pairs[index].Token_1_name,
                                tokenTwoName: $pairs[index].Token_2_name,
                                tokenOneSymbol: $pairs[index].Token_1_symbol,
                                tokenTwoSymbol: $pairs[index].Token_2_symbol,
                            });

                            /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
                            const timestamp = Math.floor(new Date().getTime() / 1000);
                            const pair = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=${item.contract_address}&chainID=42161`);
                            const jsonPair = await pair.json();

                            if (typeof jsonPair.error === `undefined`) {
                                let token = jsonPair[0];

                                let priceString = ``;
                                let zeroes = ``;
                                let price = ``;
                                let i = 0;

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
                            }
                        }
                    } else {
                        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
                        const timestamp = Math.floor(new Date().getTime() / 1000);
                        const tokenPairs = await fetch(`https://api2.sushipro.io/?action=get_pairs_by_token&token=${item.contract_address}&chainID=42161`);
                        const jsonTokenPairs = await tokenPairs.json();
                        let zeroes = ``;
                        let price = ``;

                        try {
                            if (typeof jsonTokenPairs[0].error === `undefined`) {
                                let found = false;
                                let priceString = ``;
                                let i = 0;

                                jsonTokenPairs[1].forEach((token) => {
                                    if (found === false) {
                                        if (item.contract_address === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                                            priceString = ethPrice.toFixed(32).toString();
                                            found = true;
                                        } else if (token.Token_2_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                                            priceString = parseFloat(token.Token_2_price * ethPrice).toFixed(32).toString();
                                            found = true;
                                        } else if (token.Token_1_contract === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                                            priceString = parseFloat(ethPrice * token.Token_1_price).toFixed(32).toString();
                                            found = true;
                                        }
                                    }
                                });

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
                            }
                        } catch (e) {}

                        (zeroes !== `` || price !== ``) && (netWorth += (item.holdings[0].close.balance / (10 ** item.contract_decimals)) * (zeroes + price));

                        tokens.push({
                            address: item.contract_address,
                            symbol: item.contract_ticker_symbol,
                            name: item.contract_name,
                            decimals: item.contract_decimals,
                            logo: item.logo_url,
                            holdings: item.holdings,
                            price: zeroes + price,
                        });

                        portfolioTokens.update(() => tokens);

                    }
                }
                item == items[items.length - 1] && (loading = false);
            });
        } else {
            goto(`/portfolio/`);
        }
    };

    $: $page.params.slug, refresh();
</script>

<svelte:head>
    <title>Portfolio Tracker - Arbucks</title>
    <link rel="canonical" href="/portfolio/{$page.params.slug}/">
</svelte:head>

{#if !!loading}
    <div class="container">
        <div class="loading">
            <Moon size="60" color="var(--fg-loader)" unit="px" duration="1s" />
        </div>
        <br>
        <p>{loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}</p>
    </div>
{:else}
    {#if !!valid}
        <br>
        <h1 class="title">
            {new Intl.NumberFormat(`en-US`, {
                currency: `USD`,
                style: 'currency',
            }).format(netWorth)}
        </h1>
        <p class="subtitle"><a href="https://arbiscan.io/address/${address}" rel="external noopener" target="_blank">{address}</a> <Copy text={address} /></p>
        <p class="subtitle">A chart to track your portfolio value over time is coming soon!</p>
        <h2>Tokens</h2>
        <p>P&L, 24H change, support for USDT value of Uniswap token balances, and more is coming soon!!</p>
        {#if $portfolioTokens.length > 0}
            <div class="scroller">
                <table class="tokens">
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Address</th>
                            <th>Balance</th>
                            <th>USDT Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $portfolioTokens as token}
                            <Token address={token.address} symbol={token.symbol} name={token.name} decimals={token.decimals} logo={token.logo} holdings={token.holdings} price={token.price} />
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <p>This wallet does not have any tokens on Arbitrum yet.</p>
        {/if}
        <h2>LPs</h2>
        {#if $portfolioLPs.length > 0}
            <div class="scroller">
                <table class="tokens">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Exchange</th>
                            <th>Address</th>
                            <th>Balance</th>
                            <th>USDT Value</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $portfolioLPs as lp}
                            <LP address={lp.address} name={lp.name} exchange={lp.exchange} decimals={lp.decimals} holdings={lp.holdings} tokenOneAddress={lp.tokenOneAddress} tokenTwoAddress={lp.tokenTwoAddress} tokenOneName={lp.tokenOneName} tokenTwoName={lp.tokenTwoName} tokenOneSymbol={lp.tokenOneSymbol} tokenTwoSymbol={lp.tokenTwoSymbol} />
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <p>This wallet does not have any LPs on Arbitrum yet.</p>
        {/if}
        <h2>NFTs</h2>
        {#if $portfolioNFTs.length > 0}
            <p>TODO</p>
        {:else}
            <p>This wallet does not have any NFTs on Arbitrum yet.</p>
        {/if}
        <h2>Pools</h2>
        <p><em>Coming soon!</em></p>
        <h2>Farms</h2>
        <p><em>Coming soon!</em></p>
        <h2>Futures</h2>
        <p><em>Coming soon!</em></p>
    {:else if valid === false}
        <h1>Invalid Address</h1>

        <p><em>Redirecting...</em></p>
    {/if}
{/if}

<style>
    .container {
        text-align: center;
        .loading {
            align-items: center;
            display: flex;
            margin-top: 20px;
            justify-content: center;
        }
    }
    .title, .subtitle {
        text-align: center;
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
        overflow-x: auto;
        .tokens {
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
            .tokens {
                border-collapse: separate !important;
                border-spacing: 0 1em !important;
            }
        }
    }
</style>

<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import pages from '$lib/stores/pages';
    import tokens from '$lib/stores/tokens';
    import Loader from '$lib/components/Loader/index.svelte';
    import Token from '$lib/components/Token/index.svelte';

    let loading = true;

    let newPages = [];
    let newTokens = [];
    let logos = [];

    onMount(async () => {
        (window.location.href.includes(`/tokens/`) || window.location.href.includes(`/portfolio/`)) && (goto(window.location));

                /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const reqTokens = await fetch(`https://api2.sushipro.io/?action=all_tokens&chainID=42161`);
        const jsonTokens = await reqTokens.json();
        jsonTokens[1].forEach((token) => newTokens.indexOf(newTokens.find((e) => e.Contract === token.Contract)) === -1 && (newTokens.push(token)));

        const reqLogos = await fetch(`https://bridge.arbitrum.io/token-list-42161.json`);
        const jsonLogos = await reqLogos.json();
        jsonLogos.tokens.forEach((token) => logos.push(token));

        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const json = JSON.parse(xhr.response); // TODO check for errors
            const graphTokens = json.data.tokens;
            let uniTokens = [];
            graphTokens.forEach((token) => $tokens.indexOf($tokens.find((e) => e.Contract === token.id.toLowerCase())) === -1 && (uniTokens.push({
                Contract: token.id.toLowerCase(),
                Symbol: token.symbol,
                Name: token.name,
                Decimals: token.decimals,
                Logo: `https://zapper.fi/images/${token.Symbol}-icon.png`,
            })));
            tokens.update(() => $tokens.concat(uniTokens));
        };
        xhr.onerror = () => {
            console.log(`Request failed.`);
        };
        /* The Graph has issues, but it'll have to do for now. */
        xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev`);
        xhr.setRequestHeader(`Content-Type`, `application/json`);
        xhr.send(JSON.stringify({
            query: `{\n  tokens(last: 1000) {\n    id\n    symbol\n    name\n    decimals\n\t}\n}\n`,
            variables: null,
        }));

        logos.forEach((logo) => {
            const index = newTokens.indexOf(newTokens.find((e) => e.Contract === logo.address.toLowerCase()));
            if (index > -1) {
                newTokens[index].Logo = logo.logoURI;
            } else {
                newTokens.push({
                    Contract: logo.address.toLowerCase(),
                    Symbol: logo.symbol,
                    Name: logo.name,
                    Decimals: logo.decimals,
                    Logo: logo.logoURI,
                });
            }
        });

        tokens.update(() => newTokens);

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const pagesReq = await fetch(`https://simpleanalytics.com/arbucks.io.json?version=5&fields=pages&info=false`);
        const pagesJson = await pagesReq.json();
        let i = 0;
        pagesJson.pages.forEach((page) => {
            if (i < 10) {
                if (page.value.includes(`/tokens/`)) { // TODO - sanitize by just taking substring of first part of string
                    const address = page.value.replace(`/tokens/`, ``);
                    const index = $tokens.indexOf($tokens.find((e) => e.Contract === address));
                    if (index > -1) {
                        newPages.push({
                            token: $tokens[index],
                            path: page.value,
                            views: page.pageviews,
                            uniques: page.visitors,
                        });
                        i++;
                    }
                }
            }
        });
        pages.update(() => newPages); // TODO - check for error(s) w/ "pagesJson.ok"

        loading = false;
    });
</script>

<svelte:head>
    <title>Arbucks: Arbitrum Charts, Analytics, Real-Time Data, & More</title>
    <link rel="canonical" href="https://arbucks.io">
    <meta property="og:title" content="Arbucks: Arbitrum Charts, Analytics, Real-Time Data, & More">
    <meta name=twitter:title content="Arbucks: Arbitrum Charts, Analytics, Real-Time Data, & More">
</svelte:head>

<div class="top">
    <br>
    <h1>Arbucks</h1>
    <p><em>Arbitrum's open-source charts & analytics platform</em></p>
</div>

<h2>Trending Tokens</h2>

<p>Top 10, past 30 days.</p>

{#if !!loading}
    <div class="loading">
        <Loader />
    </div>
{:else}
    <div class="scroller">
        <table class="tokens">
            <thead>
                <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each $pages as page}
                    <Token address={page.token.Contract} symbol={page.token.Symbol} name={page.token.Name} decimals={page.token.Decimals} logo={page.token.Logo || ``} />
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<h2>New Tokens</h2>

<p>Top 10 latest ERC20 deployments.</p>

<p><em>Coming soon!</em></p>

<h2>About</h2>

<ul>
    <li><p>Arbucks is a real-time, open-source gateway to Arbitrum.</p></li>
    <li><p>Explore analytics, charts, tokens, pairs, liquidity, volume, transactions, pools, and more!</p></li>
    <li><p>This is a <strong>very new</strong> project, so bugs and missing features are prevalent. If you want you can, check out <a href="/docs/" sveltekit:prefetch>the info page</a>!</p></li>
</ul>

<br>

<style>
    .top {
        text-align: center;
        h1 {
            text-shadow: 0 0 80px #888, 0 0 16px var(--fg-header);
        }
        img {
            max-width: 800px;
        }
    }
    .loading {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .scroller {
        overflow-x: auto;
        .tokens {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
            thead th {
                text-align: left;
            }
        }
    }
    @media screen and (min-width: 768px) {
        .tokens {
            border-collapse: separate !important;
            border-spacing: 0 1em !important;
        }
    }
</style>

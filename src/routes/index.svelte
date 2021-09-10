<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import pages from '$lib/stores/pages';
    import pairs from '$lib/stores/pairs';
    import { Moon } from 'svelte-loading-spinners';
    import Pair from '$lib/components/Pair/index.svelte';

    let loading = true;

    let newPages = [];
    let newPairs = [];

    onMount(async () => {
        window.location.href.includes(`/charts/`) && (goto(window.location));

        const reqPairs = await fetch(`https://api2.sushipro.io/?action=all_pairs&chainID=42161`);
        const jsonPairs = await reqPairs.json();
        jsonPairs[1].forEach((pair) => newPairs.indexOf(newPairs.find((e) => e.Pair_ID === pair.Pair_ID)) === -1 && (newPairs.push(pair)));
        pairs.update(() => newPairs);

        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const pagesReq = await fetch(`https://simpleanalytics.com/arbucks.io.json?version=5&fields=pages&info=false`);
        const pagesJson = await pagesReq.json();
        let i = 0;
        pagesJson.pages.forEach((page) => {
            if (i < 10) {
                if (page.value.includes(`/charts/`)) { // TODO - sanitize by just taking substring of first part of string
                    const address = page.value.replace(`/charts/`, ``);
                    const index = $pairs.indexOf($pairs.find((e) => e.Pair_ID === address));
                    if (index > -1) {
                        newPages.push({
                            pair: $pairs[index],
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
</svelte:head>

<h1>Welcome to Arbucks!</h1>

<h2>About</h2>

<ul>
    <li><p>Arbucks is a real-time, open-source gateway to Arbitrum.</p></li>
    <li><p>Explore analytics, charts, tokens, pairs, liquidity, volume, transactions, pools, and more!</p></li>
    <li><p>This is a <strong>very new</strong> project, so bugs and missing features are prevalent. If you want you can, check out <a href="/docs/" sveltekit:prefetch>the info page</a>!</p></li>
</ul>

<h2>New Tokens</h2>

<p><em>Coming soon!</em></p>

<h2>Trending Pairs</h2>

<p>Top 10, past 30 days.</p>

{#if !!loading}
    <div class="loading">
        <Moon size="60" color="var(--fg-loader)" unit="px" duration="1s" />
    </div>
{:else}
    <div class="scroller">
        <table class="pairs">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each $pages as page}
                    <Pair address={page.pair.Pair_ID} contractOne={page.pair.Token_1_contract} contractTwo={page.pair.Token_2_contract} nameOne={page.pair.Token_1_name} nameTwo={page.pair.Token_2_name} symbolOne={page.pair.Token_1_symbol} symbolTwo={page.pair.Token_2_symbol} decimalsOne={page.pair.Token_1_decimals} decimalsTwo={page.pair.Token_2_decimals} priceOne={page.pair.Token_1_price} priceTwo={page.pair.Token_2_price} reserveOne={page.pair.Token_1_reserve} reserveTwo={page.pair.Token_2_reserve} derivedOne={page.pair.Token_1_derived} derivedTwo={page.pair.Token_2_derived} />
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style>
    h1 {
        text-align: center;
    }
    .loading {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .scroller {
        overflow-x: auto;
        .pairs {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
            thead th {
                text-align: left;
            }
        }
    }
    @media screen and (min-width: 768px) {
        .pairs {
            border-collapse: separate !important;
            border-spacing: 0 1em !important;
        }
    }
</style>

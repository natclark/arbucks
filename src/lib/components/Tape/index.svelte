<script>
    import { onMount } from 'svelte';
    import pages from '$lib/stores/pages';
    import pairs from '$lib/stores/pairs';
    import { Moon } from 'svelte-loading-spinners';
    import Ticker from './Ticker.svelte';

    let loading = true;

    let newPages = [];
    let newPairs = [];

    onMount(async () => {
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

<div class="container">
    <div class="tape">
        <ul class="tape__tickers">
            {#each $pages as { pair, }, i}
                <Ticker id={i} {pair} />
            {/each}
        </ul>
    </div>
</div>

<style>
    @keyframes ticker {
        0% {
            transform: translate3d(0, 0, 0);
        }

        100% {
            transform: translate3d(-108rem, 0, 0);
        }
    }
    .tape {
        background-color: var(--bg-tape);
        height: 25px;
        position: relative;
        width: 100%;
        .tape__tickers {
            animation: ticker 30s linear infinite;
            display: flex;
            justify-content: space-around;
            list-style: none;
            margin: 0;
            padding-top: 3px;
            &:hover {
                animation-play-state: paused;
            }
        }
    }
</style>

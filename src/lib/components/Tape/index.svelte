<script>
    import { onMount } from 'svelte';
    import pages from '$lib/stores/pages';
    import tokens from '$lib/stores/tokens';
    import TickerItem from './TickerItem.svelte';

    let loading = true;

    let newPages = [];
    let newTokens = [];
    let logos = [];

    onMount(async () => {
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
            try {
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
            } catch (e) {}
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
        try {
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
        } catch (e) {}

        loading = false;
    });
</script>

<div class="container">
    <div class="tape">
        <ul class="tape__tickers">
            {#each $pages as { token, }, id}
                <TickerItem {id} {token} />
            {/each}
            {#each $pages as { token, }, id}
                <TickerItem {id} {token} />
            {/each}
            {#each $pages as { token, }, id}
                <TickerItem {id} {token} />
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
            transform: translate3d(-40rem, 0, 0);
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
            line-height: 1.5em;
            list-style: none;
            margin: 0;
            &:hover {
                animation-play-state: paused;
            }
        }
    }
</style>

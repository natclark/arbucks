<script>
    import { onMount } from 'svelte';
    import tokens from '$lib/stores/tokens';
    import Loader from '$lib/components/Loader/index.svelte';
    import Token from '$lib/components/Token/index.svelte';

    let sorting = false;
    let loading = true;

    let newTokens = [];
    let logos = [];

    const sort = (col) => {
        if (sorting === false) {
            loading = true;
            let table, rows, i, row, sibling, misordered, dir, switches = 0;
            table = document.querySelector(`.tokens`);
            sorting = true;
            dir = `asc`;
            do {
                sorting = false;
                rows = table.rows;
                for (i = 1; i < (rows.length - 1); i++) {
                    misordered = false;
                    row = rows[i].getElementsByTagName(`td`)[col];
                    sibling = rows[i + 1].getElementsByTagName(`td`)[col];
                    if (dir === `asc`) {
                        if (row.innerHTML.toLowerCase() > sibling.innerHTML.toLowerCase()) {
                            misordered = true;
                            break;
                        }
                    } else {
                        if (row.innerHTML.toLowerCase() < sibling.innerHTML.toLowerCase()) {
                            misordered = true;
                            break;
                        }
                    }
                }
                if (!!misordered) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    sorting = true;
                    switches++;
                } else {
                    if (switches === 0 && dir === `asc`) {
                        dir = `desc`;
                        sorting = true;
                    }
                }
            } while (sorting);
            loading = false;
        }
    }

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
            } else if (logo.address.toLowerCase() !== `0xafd871f684f21ab9d7137608c71808f83d75e6fc`) {
                newTokens.push({
                    Contract: logo.address.toLowerCase(),
                    Symbol: logo.symbol,
                    Name: logo.name,
                    Decimals: logo.decimals,
                    Logo: logo.logoURI,
                });
            }
        });

        newTokens = [{
            Contract: `0xafd871f684f21ab9d7137608c71808f83d75e6fc`,
            Symbol: `BUCK`,
            Name: `Arbucks`,
            Decimals: 18,
            Logo: `https://arbucks.io/img/arbucks-logo.png`,
        }].concat(newTokens);

        console.log(newTokens);

        tokens.update(() => newTokens);

        loading = false;
    });
</script>

<svelte:head>
    <title>Real-Time Arbitrum Token List - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/tokens/">
    <meta property="og:title" content="Real-Time Arbitrum Token List - Arbucks">
    <meta name=twitter:title content="Real-Time Arbitrum Token List - Arbucks">
</svelte:head>

<h1>Tokens ({$tokens.length})</h1>

<p>This is a real-time list of all the ERC20 tokens currently deployed on Arbitrum One.</p>

{#if !!loading}
    <div class="loading">
        <Loader />
    </div>
{:else}
    <div class="scroller">
        <table class="tokens">
            <thead>
                <tr>
                    <th on:click={() => sort(0)}>Logo</th>
                    <th on:click={() => sort(1)}>Name</th>
                    <th on:click={() => sort(2)}>Symbol</th>
                    <th on:click={() => sort(3)}>Address</th>
                    <th on:click={() => sort(4)}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each $tokens as token}
                    <Token address={token.Contract} symbol={token.Symbol} name={token.Name} decimals={token.Decimals} logo={token.Logo || ``} />
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
    .scroller {
        overflow-x: auto;
        .tokens {
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 32px;
            width: 100%;
            thead th {
                cursor: pointer;
                text-align: left;
                &:last-child {
                    text-align: center;
                }
                &:hover {
                    text-decoration: underline;
                }
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

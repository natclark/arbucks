<script>
    import { onMount } from 'svelte';
    import pairs from '$lib/stores/pairs';
    import Loader from '$lib/components/Loader/index.svelte';
    import Pair from '$lib/components/Pair/index.svelte';

    let sorting = false;
    let loading = true;

    let newPairs = [];

    const sort = (col) => {
        if (sorting === false) {
            loading = true;
            let table, rows, i, row, sibling, misordered, dir, switches = 0;
            table = document.querySelector(`.pairs`);
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
        const reqPairs = await fetch(`https://api2.sushipro.io/?action=all_pairs&chainID=42161`);
        const jsonPairs = await reqPairs.json();
        jsonPairs[1].forEach((pair) => newPairs.indexOf(newPairs.find((e) => e.Pair_ID === pair.Pair_ID)) === -1 && (newPairs.push(pair)));

        pairs.update(() => newPairs);

        loading = false;
    });
</script>

<svelte:head>
    <title>Pairs - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/pairs/">
    <meta property="og:title" content="Pairs - Arbucks">
    <meta name=twitter:title content="Pairs - Arbucks">
</svelte:head>

<h1>Pools ({$pairs.length})</h1>

<p>This is a real-time list of all the <em>Sushiswap</em> trading pairs currently available on Arbitrum One. <strong>Uniswap pairs are coming soon.</strong></p>

{#if !!loading}
    <div class="loading">
        <Loader />
    </div>
{:else}
    <div class="scroller">
        <table class="pairs">
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
                {#each $pairs as pair}
                    <Pair address={pair.Pair_ID} contractOne={pair.Token_1_contract} contractTwo={pair.Token_2_contract} nameOne={pair.Token_1_name} nameTwo={pair.Token_2_name} symbolOne={pair.Token_1_symbol} symbolTwo={pair.Token_2_symbol} decimalsOne={pair.Token_1_decimals} decimalsTwo={pair.Token_2_decimals} priceOne={pair.Token_1_price} priceTwo={pair.Token_2_price} reserveOne={pair.Token_1_reserve} reserveTwo={pair.Token_2_reserve} derivedOne={pair.Token_1_derived} derivedTwo={pair.Token_2_derived} />
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
        .pairs {
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
        .pairs {
            border-collapse: separate !important;
            border-spacing: 0 1em !important;
        }
    }
</style>

<script>
    import { onMount } from 'svelte';
    import tokens from '$lib/stores/tokens';
    import { Moon } from 'svelte-loading-spinners';
    import Token from '$lib/components/Token/index.svelte';

    let sorting = false;
    let loading = true;

    let numTokens = 0;

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
        const reqTokens = await fetch(`https://api2.sushipro.io/?action=all_tokens&chainID=42161`);
        const jsonTokens = await reqTokens.json();
        numTokens = jsonTokens[0].number_of_results;
        jsonTokens[1].forEach((token) => newTokens.push(token));

        const reqLogos = await fetch(`https://bridge.arbitrum.io/token-list-42161.json`);
        const jsonLogos = await reqLogos.json();
        jsonLogos.tokens.forEach((token) => logos.push(token));

        logos.forEach((logo) => {
            const index = newTokens.indexOf(newTokens.find((e) => e.Contract == logo.address.toLowerCase()));
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
                numTokens++;
            }
        });

        tokens.update(() => newTokens);

        loading = false;
    });
</script>

<svelte:head>
    <title>Tokens - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/tokens/">
</svelte:head>

<h1>Tokens ({numTokens})</h1>

<p>This is a real-time list of all the ERC20 tokens currently deployed on Arbitrum One.</p>

{#if !!loading}
    <div class="loading">
        <Moon size="60" color="rgba(255, 62, 0, .8)" unit="px" duration="1s" />
    </div>
{:else}
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
{/if}

<style>
    .loading {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .tokens {
        border-collapse: separate; 
        border-spacing: 0 1em;
        margin-bottom: 32px;
        width: 100%;
        thead th {
            cursor: pointer;
            text-align: left;
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>

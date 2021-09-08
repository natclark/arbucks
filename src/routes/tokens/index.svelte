<script>
    import { onMount } from 'svelte';
    import tokens from '$lib/stores/tokens';
    import Token from '$lib/components/Token/index.svelte';

    let numTokens = 0;

    let newTokens = [];
    let logos = [];

    let sorting = false;

    const sort = (col) => {
        if (sorting === false) {
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
    });
</script>

<svelte:head>
    <title>Tokens - Arbucks</title>
</svelte:head>

<h1>Tokens ({numTokens})</h1>

<table class="tokens">
    <thead>
        <tr>
            <th on:click={() => sort(0)}>Logo</th>
            <th on:click={() => sort(1)}>Name</th>
            <th on:click={() => sort(2)}>Symbol</th>
            <th on:click={() => sort(3)}>Address</th>
        </tr>
    </thead>
    <tbody>
        {#each $tokens as token}
            <Token address={token.Contract} symbol={token.Symbol} name={token.Name} decimals={token.Decimals} logo={token.Logo || ``} />
        {/each}
    </tbody>
</table>

<style>
    .tokens {
        border-collapse: separate; 
        border-spacing: 0 1em;
        margin-bottom: 32px;
        thead {
            th {
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>

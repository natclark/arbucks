<script>
    import { onMount } from 'svelte';
    import tokens from '$lib/stores/tokens';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import AutoComplete from 'simple-svelte-autocomplete';

    let select;

    let newTokens = [];
    let logos = [];
    let selectedToken;
    let selectedValue;

    const newChart = () => {
        goto(`/tokens/${selectedValue}/`);
        selectedValue = ``;
    };

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

        if ($page.params.slug) {
            try {
                /*
                TODO
                const pair = $pairs[$pairs.indexOf($pairs.find((e) => e.Pair_ID == $page.params.slug))];
                selectedToken = pair;
                selectedValue = $page.params.slug;
                select.querySelector(`input`).addEventListener(`focus`, () => selectedToken = null);
                select.addEventListener(`focusout`, () => (selectedValue === null || selectedValue === pair.Pair_ID) && (selectedToken = pair));
                */
                // TODO - add aria-autocomplete and other a11y features
            } catch (e) {
                // Pair not found. The page should be redirecting by this point anyway.
            }
        }
    });

    $: selectedValue, (typeof selectedValue !== `undefined` && selectedToken !== null) && (newChart());
</script>

<div bind:this={select} class="select">
    <AutoComplete items={$tokens} bind:selectedItem={selectedToken} bind:value={selectedValue} labelFieldName="Symbol" valueFieldName="Contract" keywordsFunction={(token) => token.Symbol} placeholder="Token symbol">
        <div slot="item" let:item={item}>
            {item.Symbol}
        </div>
        <div slot="no-results">
            <strong>NO RESULTS</strong>
        </div>
    </AutoComplete>
</div>

<style global>
    .select {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        input {
            background-color: var(--bg-autocomplete);
            border: 0;
            border-radius: 8px;
            box-shadow: rgba(0, 0, 0, .24) 0 1px 4px;
            color: var(--fg-autocomplete);
            font-size: 20px !important;
            max-width: 360px;
            opacity: .8;
            padding: 8px !important;
            transition: all .04s;
            width: 100%;
            will-change: box-shadow, opacity;
            &:hover, &:focus {
                box-shadow: rgba(0, 0, 0, .24) 0 3px 8px;
                opacity: 1;
            }
            &:focus {
                outline: none;
            }
        }
        .autocomplete-list {
            background-color: var(--bg-autocomplete) !important;
            .autocomplete-list-item {
                color: var(--fg-autocomplete) !important;
                &.selected, &:hover {
                    color: #fff !important;
                }
            }
        }
    }
</style>

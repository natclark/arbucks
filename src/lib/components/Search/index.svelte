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
    <AutoComplete items={$tokens} bind:selectedItem={selectedToken} bind:value={selectedValue} labelFieldName="Symbol" valueFieldName="Contract" keywordsFunction={(token) => `${token.Symbol} ${token.Name} ${token.Contract}`} placeholder="Token symbol">
        <div slot="item" let:item={item}>
            <div class="select__item">
                <div class="select__item__image">
                    <img src={item.Logo || `/placeholder.png`} width="32px" height="32px" alt="" aria-hidden="true">
                </div>
                <div class="select__item__text">
                    {#if item.Symbol.length > 16}
                        <p class="select__item__text__symbol"><strong>{item.Symbol.substring(0, 16)}...</strong></p>
                    {:else}
                        <p class="select__item__text__symbol">{item.Symbol}</p>
                    {/if}
                    {#if item.Name.length > 16}
                        <p class="select__item__text__name"><strong>{item.Name.substring(0, 16)}...</strong></p>
                    {:else}
                        <p class="select__item__text__name">{item.Name}</p>
                    {/if}
                </div>
            </div>
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
        .select__item {
            align-items: center;
            display: flex;
            justify-content: space-between;
            margin: 8px;
            .select__item__image {
                margin-top: 2px;
                width: 20%;
            }
            .select__item__text {
                display: block;
                text-align: left !important;
                width: 80%;
                p {
                    margin: 0;
                    &.select__item__text__symbol {
                        font-family: var(--font-bold);
                        margin-bottom: 4px;
                    }
                    &.select__item__text__name {
                        font-size: 14px;
                    }
                }
            }
        }
        .autocomplete::after {
            border-color: var(--fg) !important;
            border-width: 2px !important;
        }
        input {
            background-color: var(--bg-soft);
            border: 0;
            border-radius: 24px;
            box-shadow: rgba(0, 0, 0, .24) 0 1px 4px;
            color: var(--fg);
            font-family: var(--font) !important;
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
                box-shadow: rgba(0, 0, 0, .16) 0 1px 4px, var(--ac) 0 0 0 2px;
                outline: none;
            }
        }
        .autocomplete-list {
            background-color: var(--bg-soft) !important;
            border: 0 !important;
            border-radius: 24px;
            max-height: 200px !important;
            max-width: 213px;
            outline: none !important;
            scrollbar-color: var(--fg-scroll) var(--bg-scroll);
            scrollbar-face-color: var(--fg-scroll);
            scrollbar-track-color: var(--bg-scroll);
            scrollbar-width: thin;
            .autocomplete-list-item {
                color: var(--fg) !important;
                will-change: background-color, color;
                .select__item {
                    margin: 0;
                }
                &.selected, &:hover {
                    background-color: var(--bg-hover);
                    color: #fff !important;
                }
            }
            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-corner, ::-webkit-scrollbar-track {
                background-color: var(--bg-scroll);
                border-radius: 24px;
            }
            ::-webkit-scrollbar-thumb {
                background-image: var(--gr-scroll);
                border-radius: 24px;
            }
        }
    }
</style>

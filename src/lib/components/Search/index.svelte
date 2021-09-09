<script>
    import { onMount } from 'svelte';
    import pairs from '$lib/stores/pairs';
    import { goto } from '$app/navigation';
    import AutoComplete from 'simple-svelte-autocomplete';

    let newPairs = [];
    let selectedPair;
    let selectedValue;

    onMount(async () => {
        /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
        const reqPairs = await fetch(`https://api2.sushipro.io/?action=all_pairs&chainID=42161`);
        const jsonPairs = await reqPairs.json();
        jsonPairs[1].forEach((pair) => {
            if (newPairs.indexOf(newPairs.find((e) => e.Pair_ID === pair.Pair_ID)) === -1) {
                pair.Symbol = `${pair.Token_1_symbol} / ${pair.Token_2_symbol}`;
                newPairs.push(pair);
            }
        });

        pairs.update(() => newPairs);
    });

    $: selectedValue, typeof selectedValue !== `undefined` && (goto(`/charts/${selectedValue}/`));
</script>

<div class="select">
    <AutoComplete items={$pairs} bind:selectedItem={selectedPair} bind:value={selectedValue} labelFieldName="Symbol" valueFieldName="Pair_ID" keywordsFunction={(token) => token.Token_1_symbol + `/` + token.Token_2_symbol} />
</div>


<style global>
    .select {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        input {
            border: 0;
            border-radius: 8px;
            box-shadow: rgba(0, 0, 0, .24) 0 1px 4px;
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
    }
</style>

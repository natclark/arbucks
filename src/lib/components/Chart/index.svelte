<script>
    import { onMount } from 'svelte';

    export let id;
    export let pairAddress;
    export let tokenOneAddress;
    export let tokenTwoAddress;
    export let tokenOnePrice;
    export let tokenTwoPrice;
    export let tokenOneSymbol;
    export let tokenTwoSymbol;
    export let ethPrice;
</script>

<iframe class="chart" src="https://charts.arbucks.io/#{tokenTwoAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1` ? tokenOneAddress : tokenTwoAddress}::{tokenTwoAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1` ? tokenOneSymbol : tokenTwoSymbol}::{tokenOneAddress}::{tokenTwoAddress}::{pairAddress}" width="100%" height="400px" />

<style global>
    .chart {
        border: 0;
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, .45) 0 25px 20px -20px;
        height: 400px;
    }
    @media screen and (min-width: 768px) {
        .chart {
            height: 600px;
        }
    }
</style>

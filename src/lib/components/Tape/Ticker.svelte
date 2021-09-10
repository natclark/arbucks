<script>
    export let id;
    export let pair;
</script>

<li>
    <p class={id === 0 ? `bold` : ``}>
        #{id + 1}
        &nbsp;
        <a href="/charts/{pair.Pair_ID}/" sveltekit:prefetch>
            {pair.Token_1_symbol} / {pair.Token_2_symbol}
        </a>
    </p>
</li>

<style>
    li, p {
        margin: 0;
    }
    li {
        color: #777;
        display: inline-block;
        padding: 0 20px;
        white-space: nowrap;
    }
    .bold {
        font-weight: 700;
    }
    a {
        color: #000;
        &:hover {
            color: #000;
        }
    }
</style>

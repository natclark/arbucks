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
        color: #aaa;
        display: inline-block;
        padding: 0 20px;
        max-width: 16rem;
        white-space: nowrap;
    }
    .bold {
        font-weight: 700;
    }
    a {
        color: var(--fg-body);
        &:hover {
            color: var(--fg-body);
        }
    }
</style>

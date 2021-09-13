<script>
    export let id;
    export let token;
</script>

<li>
    <p class={id === 0 ? `bold` : ``}>
        #{id + 1}
        &nbsp;
        <a href="/tokens/{token.Contract}/" sveltekit:prefetch>
            {token.Symbol}
        </a>
    </p>
</li>

<style>
    li {
        color: #aaa;
        display: inline-block;
        padding: 0 20px;
        margin: 0;
        max-width: 16rem;
        white-space: nowrap;
        p {
            margin: 0;
            a {
                color: var(--fg-body);
                &:hover {
                    color: var(--fg-body);
                }
            }
            &.bold {
                font-weight: 700;
            }
        }
    }
</style>

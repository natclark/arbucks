<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import ripple from '$lib/services/ripple';

    let doc;

    onMount(() => doc = document);
</script>

<div class="grid">
    <aside>
        <ol>
            <li>
                <a href="/docs/" aria-current="{$page.path === `/docs/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Introduction</a>
            </li>
            <li>
                <a href="/docs/faq/" aria-current="{$page.path === `/docs/faq/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>FAQ</a>
            </li>
            <li>
                <a href="/docs/roadmap/" aria-current="{$page.path === `/docs/roadmap/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Roadmap</a>
            </li>
            <li>
                <a href="/docs/token/" aria-current="{$page.path === `/docs/token/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Token</a>
            </li>
            <li>
                <a href="/docs/governance/" aria-current="{$page.path === `/docs/governance/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Governance</a>
            </li>
            <li>
                <a href="/docs/decentralization/" aria-current="{$page.path === `/docs/decentralization/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Decentralization</a>
            </li>
            <li>
                <a href="/docs/transparency/" aria-current="{$page.path === `/docs/transparency/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Transparency</a>
            </li>
            <li>
                <a href="/docs/manifesto/" aria-current="{$page.path === `/docs/manifesto/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Manifesto</a>
            </li>
            <li>
                <a href="/docs/api/" aria-current="{$page.path === `/docs/api/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>API</a>
            </li>
            <li>
                <a href="/docs/disclaimer/" aria-current="{$page.path === `/docs/disclaimer/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Disclaimer</a>
            </li>
        </ol>
    </aside>
    <div>
        <slot />
    </div>
</div>

<style>
    .grid {
        display: block;
        margin: 0 auto;
        aside {
            align-self: start;
            background-color: rgba(239, 222, 205, .6);
            border-radius: 8px;
            box-shadow: 0 1px 2px 0 #111;
            margin: 1.5em 2rem 0;
            padding: .5rem 0;
            position: sticky;
            top: 28px;
            ol {
                list-style: none;
                margin: 0;
                padding: 8px;
                li {
                    margin-bottom: 8px;
                    a {
                        border-radius: 4px;
                        color: #222;
                        display: block;
                        font-size: 19px;
                        font-weight: 600;
                        overflow: hidden;
                        padding: 4px;
                        position: relative;
                        text-decoration: none;
                        width: 100%;
                        &[aria-current="page"] {
                            background-color: rgba(238, 208, 178, .6);
                            color: #000;
                        }
                        &:hover {
                            background-color: rgb(238, 208, 178);
                        }
                    }
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
    @media screen and (min-width: 768px) {
        .grid {
            display: grid;
        grid-template-columns: 15em 0.8fr;
        }
    }
</style>

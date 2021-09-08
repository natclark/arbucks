<script context="module">
    import { browser, dev } from '$app/env';
    export const hydrate = dev;
    export const router = browser;
    export const prerender = true;
</script>

<script>
    import '$lib/global.scss';
    import Navbar from '$lib/components/Navbar/index.svelte';
</script>

<Navbar />

<div class="container">
    <main>
        <slot />
    </main>
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: 1fr min(80ch, 100%) 1fr;
        > * {
            grid-column: 2;
        }
        main {
            padding: 0 8px;
        }
    }
</style>

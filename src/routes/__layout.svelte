<script context="module">
    import { browser, dev } from '$app/env';
    export const hydrate = dev;
    export const router = browser;
    export const prerender = true;
</script>

<script>
    import '$lib/global.scss';
    import Navbar from '$lib/components/Navbar/index.svelte';
    import Footer from '$lib/components/Footer/index.svelte';
</script>

<svelte:head>
    <script type="text/javascript" src="https://api.arbucks.io/latest.js" async defer></script>
</svelte:head>

<Navbar />

<div class="container">
    <main>
        <slot />
    </main>
</div>

<Footer />

<style>
    .container {
        display: grid;
        grid-template-columns: 1fr min(100ch, 100%) 1fr;
        > * {
            grid-column: 2;
        }
        main {
            min-height: 100vh;
            padding: 0 8px;
        }
    }
</style>

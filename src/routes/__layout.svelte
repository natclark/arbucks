<script context="module">
    import { browser } from '$app/env';
    export const hydrate = true;
    export const router = browser;
    export const prerender = true;
</script>

<script>
    import '$lib/global.scss';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Navbar from '$lib/components/Navbar/index.svelte';
    import Alert from '$lib/components/Alert/index.svelte';
    import Footer from '$lib/components/Footer/index.svelte';

    onMount(() => {
        (window.location.href.includes(`/charts/`)) && (goto(`/tokens/`));
        (window.location.href.includes(`/pairs/`)) && (goto(`/pools/`));
    });
</script>

<svelte:head>
    <script type="text/javascript" src="https://api.arbucks.io/latest.js" async defer></script>
</svelte:head>

<Navbar />

<div class="container">
    <main>
        <Alert title="Important" message="We're currently undergoing a transition to TradingView charts on this website. There may be some bugs and rendering issues. Also, our data is currently behind due to The Graph having issues resyncing with the latest blocks following Arbitrum Ones's brief outage last Monday. We expect all this to be fixed in the next couple of days. Thank you for your patience. We have so much in store for the future!" />
        <slot />
    </main>
</div>

<Footer />

<style>
    .container {
        display: grid;
        grid-template-columns: 1fr min(135ch, 100%) 1fr;
        > * {
            grid-column: 2;
        }
        main {
            min-height: 100vh;
            padding: 0 8px;
        }
    }
</style>

<script context="module">
    import { browser } from '$app/env';
    export const hydrate = true;
    export const router = browser;
    export const prerender = true;
    export const load = async ({ page }) => ({
        props: {
            key: page.path,
        },
    });
</script>

<script>
    import '$lib/global.scss';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Navbar from '$lib/components/Navbar/index.svelte';
    import Alert from '$lib/components/Alert/index.svelte';
    import Transition from '$lib/components/Transition/index.svelte';
    import Footer from '$lib/components/Footer/index.svelte';

    export let key;

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
        <Alert />
        <Transition refresh={key}>
            <slot />
        </Transition>
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

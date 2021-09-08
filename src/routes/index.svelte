<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbucks</title>
    <link rel="canonical" href="https://arbucks.io">
</svelte:head>

<h1>Welcome to Arbucks!</h1>

<h2>New Tokens</h2>

<p><em>Coming soon!</em></p>

<h2>Trending Tokens</h2>

<p><em>Coming soon!</em></p>

<h2>About</h2>

<ul>
    <li><p>Arbucks is a real-time, open-source gateway to Arbitrum.</p></li>
    <li><p>Explore analytics, charts, tokens, pairs, liquidity, volume, transactions, pools, and more!</p></li>
    <li><p>This is a <strong>very new</strong> project, so bugs and missing features are prevalent. If you're looking for more info, check out <a href="/faq/" sveltekit:prefetch>the FAQ</a>!</p></li>
</ul>

<style>
    h1 {
        text-align: center;
    }
</style>

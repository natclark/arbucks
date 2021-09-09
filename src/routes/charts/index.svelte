<script>
    import Chart from '$lib/components/Chart/index.svelte';
    import Search from '$lib/components/Search/index.svelte';
</script>


<svelte:head>
    <title>Charts - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/charts/">
</svelte:head>

<div class="flex">
    <h1>Charts</h1>
    <Search />
</div>

<br>
<p><em>More features on this page are coming soon!</em></p>

<!--
TODO
<Chart id="0" address="0xf97f4df75117a78c1a5a0dbb814af92458539fb4" />
-->

<style>
    .flex {
        display: block;
        margin: 24px 0;
    }
    @media screen and (min-width: 768px) {
        .flex {
            display: flex;
            justify-content: space-between;
        }
    }
</style>

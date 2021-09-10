<script>
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

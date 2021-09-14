<script>
    export let title;
    export let description;
    export let path;
</script>

<svelte:head>
    <title>{title} - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/blog/{path}/">
    <meta property="og:title" content="{title} - Arbucks">
    <meta name=twitter:title content="{title} - Arbucks">
</svelte:head>

<a class="post" href="/blog/{path}/">
    <h3 class="post__title">{title}</h3>
    <p class="post__description">{description}</p>
</a>

<style>
    .post {
        background-color: var(--bg-row);
        &:hover {
            background-color: var(--bg-row-hover);
            text-decoration: none;
        }
    }
</style>

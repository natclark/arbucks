<script>
    export let title;
    export let time;
    export let description;
    export let path;
    export let thumbnail;
</script>

<a class="post" href="/blog/{path}/" sveltekit:prefetch>
    <img class="post__thumbnail" src="https://cloudflare-ipfs.com/ipfs/{thumbnail}" alt="{title} Preview">
    <div>
        <h2 class="post__title">{title}</h2>
        <p class="post__date"><time datetime="{time}">{new Date(time).toDateString().slice(4)}</time></p>
        <p class="post__description"><slot /></p>
    </div>
</a>

<style>
    .post {
        background-color: var(--bg-soft);
        border-radius: 16px;
        display: block;
        margin-bottom: 24px;
        padding: 24px;
        .post__thumbnail {
            border-radius: 8px;
            height: 180px;
            margin-bottom: 12px;
            width: 100%;
        }
        div {
            .post__title {
                font-size: 28px;
                line-height: 1.2em;
                margin: 0 0 8px;
                text-align: left;
            }
            .post__date {
                color: var(--fg);
                font-size: 16px;
            }
            .post__description {
                color: var(--fg);
                font-size: 18px;
                line-height: 1.3em;
                margin-bottom: 6px;
            }
        }
        &:hover {
            background-color: var(--bg-hover);
            text-decoration: none;
        }
    }
    @media screen and (min-width: 768px) {
        .post {
            align-items: center;
            column-gap: 24px;
            display: flex;
            justify-content: center;
            .post__thumbnail {
                max-width: 180px;
                margin-bottom: 0;
            }
        }
    }
</style>

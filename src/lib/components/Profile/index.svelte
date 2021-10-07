<script>
    export let picture;
    export let telegram;
    export let title;
    export let role;
    export let description;
    export let flag;
</script>

<div class="profile">
    <img class="profile__picture" src="https://cloudflare-ipfs.com/ipfs/{picture}" alt="@{telegram}'s profile picture" loading="lazy">
    <p><a class="profile__telegram" href="https://t.me/{telegram}" rel="external noopener nofollow" target="_blank">@{telegram}</a></p>
    <p>{title} {flag}</p>
    <blockquote class="profile__description">&ldquo;{description}&rdquo;</blockquote>
</div>

<style>
    .profile {
        max-width: 270px;
        text-align: center;
        width: 100%;
        .profile__picture {
            border-radius: 50%;
            max-height: 128px;
            max-width: 128px;
        }
        .profile__telegram {
            color: var(--ac-light) !important;
        }
        .profile__description {
            font-style: italic;
        }
    }
</style>

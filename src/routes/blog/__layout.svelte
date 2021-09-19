<div class="wrapper">
    <div class="container blog__content">
        <slot />
    </div>
</div>

<style>
    .wrapper {
        align-items: center;
        display: flex;
        justify-content: center;
        margin-bottom: 80px;
        .container {
            max-width: 768px;
        }
    }
    :global {
        .blog__title {
            text-align: center;
            & + p {
                text-align: center;
            }
        }
        .blog__image {
            border-radius: 16px;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
            max-height: 500px;
            max-width: 768px;
            width: 100%;
        }
        .blog__content {
            line-height: 1.3em;
        }
    }
</style>

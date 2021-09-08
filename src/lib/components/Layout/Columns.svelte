<div class="columns">
    <slot />
</div>

<style>
    .columns {
        display: block;
        width: 100%;
    }
    @media screen and (min-width: 768px) {
        .columns {
            column-gap: 3px;
            display: flex;
            justify-content: space-between;
        }
    }
</style>

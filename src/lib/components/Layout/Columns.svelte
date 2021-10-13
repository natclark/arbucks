<div class="columns">
    <slot />
</div>

<style>
    .columns {
        display: flex;
        flex-direction: column;
        margin-bottom: 24px;
        row-gap: 24px;
        width: 100%;
    }
    @media screen and (min-width: 768px) {
        .columns {
            column-gap: 24px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>

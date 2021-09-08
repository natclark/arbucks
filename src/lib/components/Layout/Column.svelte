<div class="column">
    <slot />
</div>

<style>
    .column {
        width: 100%;
    }
    @media screen and (min-width: 768px) {
        .column {
            width: 50%;
        }
    }
</style>

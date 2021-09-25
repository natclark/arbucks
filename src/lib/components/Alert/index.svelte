<script>
    import { onMount } from 'svelte';

    export let title;
    export let background;
    export let message;

    let show = false;
    let ss;

    const close = () => {
        show = false;
        ss !== null && (ss.setItem(`arbucks::v0:banner`, `false`));
    };

    onMount(() => {
        if (typeof sessionStorage !== `undefined`) {
            ss = sessionStorage;
            try {
                if (ss.getItem(`arbucks::v0:banner`)) {
                    const banner = ss.getItem(`arbucks::v0:banner`);
                    if (banner == `true`) show = true;
                } else {
                    const banner = ss.setItem(`arbucks::v0:banner`, `true`);
                    show = true;
                }
            } catch (e) {}
        }
    });
</script>

{#if show}
    <div class="alert {background}">
        <p><strong>{title}:</strong> {message}</p>
        <button on:click={close}>Close</button>
    </div>
{/if}

<style>
    .alert {
        background-color: rgba(255, 0, 0, .15) !important;
        color: #fff;
        margin-top: 20px;
        padding: 10px 20px;
        width: 100%;
        p {
            line-height: 1.3em;
            margin: 0;
        }
        button {
            background-color: rgba(255, 0, 0, .4);
            border: 0;
            border-radius: 4px;
            cursor: pointer;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            margin-top: 10px;
            outline: none;
            padding: 4px;
        }
        &.warning {
            background-color: rgba(255, 255, 0, .15) !important;
            button {
                background-color: rgba(255, 255, 0, .4) !important;
            }
        }
    }
</style>

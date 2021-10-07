<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let address;
    export let symbol;
    export let name;
    export let decimals;
    export let logo;

    let doc;

    onMount(() => doc = document);
</script>

<tr class="token">
    <td class="logo">
        {#if logo !== ``}
            <img src={logo} loading="lazy" width="32px" height="32px" aria-hidden="true">
        {:else}
            <img src="/placeholder.png" loading="lazy" width="32px" height="32px" aria-hidden="true">
        {/if}
    </td>
    <td class="name">
        {name}
    </td>
    <td>
        {symbol}
    </td>
    <td>
        <a href="https://arbiscan.io/token/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a> <Copy text={address} />
    </td>
    <td class="actions">
        <a class="actions__buy" href="https://app.sushi.com/swap?outputCurrency={address}" rel="external noopener" target="_blank" draggable="false">Trade</a>
        <a class="actions__view" href="/tokens/{address}/" draggable="false" sveltekit:prefetch>View</a>
    </td>
</tr>

<style>
    .token {
        background-color: var(--bg-soft);
        border-radius: 8px;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        position: relative;
        transition: box-shadow .07s;
        will-change: background-color, box-shadow;
        td {
            text-align: left;
            width: auto;
            &.logo {
                padding: 4px 8px 0;
                img {
                    height: 16px;
                    width: 16px;
                }
            }
            &.name {
                font-weight: 700;
            }
            &.actions {
                align-items: center;
                display: flex;
                justify-content: space-between;
                text-align: center;
                .actions__buy {
                    color: var(--ac-btn);
                }
                .actions__view {
                    color: var(--ac);
                }
            }
        }
        &:hover {
            background-color: var(--bg-hover);
            box-shadow: rgba(99, 99, 99, .2) 0 4px 12px 0;
        }
    }
    @media screen and (min-width: 768px) {
        .token {
            font-size: 16px;
            td {
                &.logo img {
                    height: 32px;
                    width: 32px;
                }
                &.actions {
                    align-items: center;
                    display: flex;
                    justify-content: center;
                    column-gap: 12px;
                    height: 40px;
                }
            }
        }
    }
</style>

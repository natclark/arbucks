<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let address;
    export let symbol;
    export let name;
    export let decimals;
    export let logo;
    export let holdings;
    export let price;

    let row;
    let doc;

    onMount(() => {
        doc = document;
        /*
        TODO
        row.addEventListener(`mousedown`, (e) => {
            ripple(e, document);
        }, true);
        */
    });
</script>

<tr bind:this={row} class="token">
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
    <td>
        {holdings[0].close.balance / (10 ** decimals)}
    </td>
    <td>
        {new Intl.NumberFormat(`en-US`, {
            currency: `USD`,
            style: 'currency',
        }).format((holdings[0].close.balance / (10 ** decimals)) * price)}
    </td>
    <td class="actions">
        {#if address !== ``}
            <a class="button" href="/tokens/{address}/" draggable="false" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>View</a>
        {/if}
        <a class="button button--buy" href="https://app.sushi.com/swap?outputCurrency={address}" rel="external noopener" target="_blank" draggable="false" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>Trade</a>
    </td>
</tr>

<style>
    .token {
        background-color: var(--bg-row);
        border-radius: 8px;
        box-shadow: rgba(99, 99, 99, .2) 0 2px 8px 0;
        font-size: 12px;
        height: 60px;
        overflow: hidden;
        position: relative;
        transition: all .07s;
        will-change: background-color, box-shadow;
        td {
            text-align: left;
            width: auto;
            &.logo {
                padding: 0 8px;
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
            }
        }
        &:hover {
            background-color: var(--bg-row-hover);
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
                    display: table-cell;
                }
            }
        }
    }
</style>

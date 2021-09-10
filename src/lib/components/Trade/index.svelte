<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let timestamp;
    export let type;
    export let amount;
    export let address;

    const difference = Math.floor(new Date().getTime() / 1000) - parseInt(timestamp);
    let time = ``;
    if (difference < 60) time = `${difference} seconds ago`;
    else if (difference < 3600) time = `${Math.floor(difference / 60)} minutes ago`;
    else if (difference < 86400) time = `${Math.floor(difference / 3600)} hours ago`;
    else if (difference < 2620800) time = `${Math.floor(difference / 86400)} days ago`;
    else if (difference < 31449600) time = `${Math.floor(difference / 2620800)} months ago`;
    else time = `${Math.floor(difference / 31449600)} years ago`;

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

<tr bind:this={row} class="trade">
    <td>
        {time}
    </td>
    <td>
        <span class={type.toLowerCase()}>{type}</span>
    </td>
    <td class="{type.toLowerCase()}Text">
        {#if type === `Buy`}
            {amount}
        {:else}
            ({amount})
        {/if}
    </td>
    <td>
        <p><em>Coming soon!</em></p>
    </td>
    <td>
        <a href="https://arbiscan.io/tx/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a> <Copy text={address} />
    </td>
</tr>

<style>
    .trade {
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
            span {
                border-radius: 8px;
                color: #fff;
                font-weight: 600;
                padding: 8px;
                &.buy {
                    background-color: var(--fg-buy);
                }
                &.sell {
                    background-color: var(--fg-sell);
                }
            }
            &.buyText, &.sellText {
                font-weight: 500;
            }
            &.buyText {
                color: var(--fg-buy);
            }
            &.sellText {
                color: var(--fg-sell);
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
        .trade {
            font-size: 16px;
            td {
                &.actions {
                    display: table-cell;
                }
            }
        }
    }
</style>

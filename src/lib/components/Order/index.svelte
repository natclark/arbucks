
<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let timestamp;
    export let type;
    export let amount;
    export let address;
    export let pair;
    export let name;
    export let sender;

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
            {new Intl.NumberFormat(`en-US`, {
                currency: `USD`,
                style: 'currency',
            }).format(amount)}
        {:else}
            ({new Intl.NumberFormat(`en-US`, {
                currency: `USD`,
                style: 'currency',
            }).format(amount)})
        {/if}
    </td>
    <td>
        <p><em>Coming soon!</em></p>
    </td>
    <td>
        {name}
    </td>
    <td>
        <a href="https://arbiscan.io/address/{pair}" rel="external noopener" target="_blank">{pair.substr(0, 6)}...{pair.substr(address.length - 7, pair.length - 1)}</a> <Copy text={pair} />
    </td>
    <td>
        <a href="https://arbiscan.io/tx/{address.substring(0, address.length - 2)}" rel="external noopener" target="_blank">{address.substring(0, 6)}...{address.substring(address.length - 9, address.length - 2)}</a> <Copy text={address} />
    </td>
</tr>

<style>
    .trade {
        background-color: var(--bg);
        border-radius: 8px;
        font-size: 12px;
        height: 40px;
        overflow: hidden;
        position: relative;
        will-change: background-color, box-shadow;
        td {
            text-align: left;
            width: auto;
            p {
                margin: 8px 0;
            }
            span {
                border-radius: 8px;
                color: #000;
                padding: 7px 4px 4px;
                &.buy {
                    background-color: rgb(0, 201, 0, .2);
                    color: var(--ac-btn);
                }
                &.sell {
                    background-color: rgb(255, 110, 110, .2);
                    color: var(--ac-red);
                }
            }
            &.buyText, &.sellText {
                font-weight: 500;
            }
            &.buyText {
                color: var(--ac-btn);
            }
            &.sellText {
                color: var(--ac-red);
            }
            &.actions {
                align-items: center;
                display: flex;
                justify-content: space-between;
                text-align: center;
            }
        }
    }
    @media screen and (min-width: 768px) {
        .trade {
            font-size: 18px;
            td {
                &.actions {
                    display: table-cell;
                }
            }
        }
    }
</style>

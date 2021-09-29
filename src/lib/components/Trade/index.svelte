<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let timestamp;
    export let tokenOneAddress;
    export let tokenTwoAddress;
    export let type;
    export let amount;
    export let maker;
    export let address;
    export let version;

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

<tr bind:this={row} class="trade{version === `desktop` ? ` trade--desktop` : ``}">
    <td>
        {time}
    </td>
    <td class="{type}Text">
        {#if type === `buy`}
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
    <!--
    <td>
        <p>0.00%</p>
    </td>
    -->
    <td>
        <a href="https://arbiscan.io/address/{maker}" rel="external noopener" target="_blank">{maker.substr(0, 6)}...</a> <Copy text={maker} small="true" />
    </td>
    <td class="actions">
        <a href="https://arbiscan.io/tx/{address}" rel="external noopener" target="_blank">
            <img src="https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.3" alt="Arbiscan Logo" height="16px" width="16px" loading="lazy">
        </a>
    </td>
</tr>

<style>
    .trade {
        background-color: var(--bg-row-dark);
        border-radius: 8px;
        box-shadow: rgba(99, 99, 99, .1) 0 2px 8px 0;
        font-size: 12px;
        height: 20px;
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
                font-size: 12px;
                padding: 7px 4px 4px;
                &.buy {
                    background-color: rgb(0, 201, 0, .2);
                    color: #00c900;
                }
                &.sell {
                    background-color: rgb(255, 110, 110, .2);
                    color: #ff6e6e;
                }
            }
            &.buyText, &.sellText {
                font-weight: 500;
            }
            &.buyText {
                color: #02c77a;
            }
            &.sellText {
                color: #ff3b69;
            }
            &.actions {
                align-items: center;
                display: flex;
                justify-content: space-between;
                text-align: center;
            }
        }
        &.trade--desktop {
            font-size: 12px !important;
            height: 28px;
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

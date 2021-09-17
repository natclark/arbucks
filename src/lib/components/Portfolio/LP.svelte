<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let address;
    export let exchange;
    export let name;
    export let decimals;
    export let holdings;
    export let tokenOneAddress;
    export let tokenTwoAddress;
    export let tokenOneName;
    export let tokenTwoName;
    export let tokenOneSymbol;
    export let tokenTwoSymbol;

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
    <td class="name">
        {tokenOneName} / {tokenTwoName}
    </td>
    <td>
        {tokenOneSymbol} / {tokenTwoSymbol}
    </td>
    <td>
        {exchange}
    </td>
    <td>
        <a href="https://arbiscan.io/token/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a> <Copy text={address} />
    </td>
    <td>
        {holdings[0].close.balance / (10 ** decimals)}
    </td>
    <td>
        Coming soon!
    </td>
    <td class="actions">
        <a class="button button--buy" href="https://app.sushi.com/add/{tokenOneAddress}/{tokenTwoAddress}" rel="external noopener" target="_blank" draggable="false" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>Liquidity</a>
        <a class="button" href="/charts/{address}/" draggable="false" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>View</a>
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
        transition: box-shadow .07s;
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

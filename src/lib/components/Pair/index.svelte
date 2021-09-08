<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';

    export let address;
    export let contractOne;
    export let contractTwo;
    export let symbolOne;
    export let symbolTwo;
    export let nameOne;
    export let nameTwo;
    export let decimalsOne;
    export let decimalsTwo;
    export let priceOne;
    export let priceTwo;
    export let reserveOne;
    export let reserveTwo;
    export let derivedOne;
    export let derivedTwo;

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

<tr bind:this={row} class="pair">
    <td class="name">
        {nameOne} / {nameTwo}
    </td>
    <td>
        {symbolOne} / {symbolTwo}
    </td>
    <td>
        <a href="https://arbiscan.io/token/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a>
    </td>
    <td class="actions">
        <a href="https://app.sushi.com/add/{contractOne}/{contractTwo}" rel="external noopener" target="_blank" draggable="false" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>Liquidity</a>
        <a href="/charts/{address}/" draggable="false" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>View</a>
    </td>
</tr>

<style>
    .pair {
        background-color: rgba(239, 222, 205, .6);
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
            &.actions a {
                background-color: #008000;
                border-radius: 8px;
                color: #fff;
                font-weight: 600;
                overflow: hidden;
                padding: 8px;
                position: relative;
                text-decoration: none;
                transition: all .06s;
                width: 100%;
                will-change: opacity;
                &:last-child {
                    background-color: #aa8e68;
                }
                &:hover {
                    opacity: .8;
                }
            }
        }
        &:hover {
            background-color: rgba(239, 222, 205, .8);
            box-shadow: rgba(99, 99, 99, .2) 0 4px 12px 0;
        }
    }
    @media screen and (min-width: 768px) {
        .pair {
            font-size: 16px;
            td {
                &.logo img {
                    height: 32px;
                    width: 32px;
                }
            }
        }
    }
</style>

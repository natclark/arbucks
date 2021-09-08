<script>
    import { onMount } from 'svelte';
    import ripple from '$lib/services/ripple';

    export let address;
    export let symbol;
    export let name;
    export let decimals;
    export let logo;

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
            <img src="/placeholder.svg" loading="lazy" width="32px" height="32px" aria-hidden="true">
        {/if}
    </td>
    <td class="name">
        {name}
    </td>
    <td>
        {symbol}
    </td>
    <td>
        <a href="https://arbiscan.io/token/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a>
    </td>
    <td class="actions">
        <a href="https://app.sushi.com/swap?outputCurrency={address}" rel="external noopener" target="_blank" draggable="false" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>Trade</a>
    </td>
</tr>

<style>
    .token {
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
        .token {
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

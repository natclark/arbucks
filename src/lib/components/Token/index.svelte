<script>
    export let address;
    export let symbol;
    export let name;
    export let decimals;
    export let logo;
</script>

<tr class="token">
    <td class="logo">
        {#if logo !== ``}
            <img src={logo} loading="lazy" width="32px" height="32px" aria-hidden="true">
        {:else}
            <img src="/placeholder.svg" loading="lazy" width="32px" height="32px" aria-hidden="true">
        {/if}
    </td>
    <td class="name">{name}</td>
    <td>{symbol}</td>
    <td>
        <a href="https://arbiscan.io/token/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a>
    </td>
</tr>

<style>
    .token {
        background-color: rgba(239, 222, 205, .6);
        border-radius: 8px;
        box-shadow: rgba(99, 99, 99, .2) 0 2px 8px 0;
        font-size: 12px;
        height: 60px;
        transition: all .07s;
        will-change: background-color, box-shadow;
        td {
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
        }
        &:hover {
            background-color: rgba(239, 222, 205, .8);
            box-shadow: rgba(0, 0, 0, .24) 0 3px 8px;
        }
    }
    @media screen and (min-width: 768px) {
        .token {
            font-size: 16px;
            td {
                width: 10%;
                &.logo img {
                    height: 32px;
                    width: 32px;
                }
            }
        }
    }
</style>

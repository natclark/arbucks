<script>
    import { onMount } from 'svelte';
    import portfolioWallets from '$lib/stores/portfolioWallets';
    import Copy from '$lib/components/Copy/index.svelte';

    export let name;
    export let address;

    let ls;

    const del = () => {
        if (!!ls) {
            const wallets = ls.getItem(`arbucks::v0:wallets`);
            if (wallets !== null) {
                try {
                    let newWallets = JSON.parse(wallets);
                    newWallets.splice(newWallets.indexOf(newWallets.find((e) => e.address === address)), 1);
                    localStorage.setItem(`arbucks::v0:wallets`, JSON.stringify(newWallets));
                    //portfolioWallets.update(() => JSON.stringify(newWallets));
                } catch (e) {
                    //portfolioWallets.update(() => null);
                }
            }
        }
    };

    onMount(() => typeof localStorage !== `undefined` && (ls = localStorage));
</script>

<tr class="wallet">
    <td class="name">
        {name}
    </td>
    <td>
        <a href="https://arbiscan.io/address/{address}" rel="external noopener" target="_blank">{address.substr(0, 6)}...{address.substr(address.length - 7, address.length - 1)}</a> <Copy text={address} />
    </td>
    <td class="actions">
        <a class="button" href="/portfolio/{address}/" draggable="false" sveltekit:prefetch>View</a>
        <a class="button button--sell" draggable="false" role="button" on:click={del}>Delete</a>
    </td>
</tr>

<style>
    .wallet {
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
            a.button--sell {
                cursor: pointer;
            }
            &.name {
                font-weight: 700;
            }
            &.actions {
                align-items: center;
                display: flex;
                justify-content: space-between;
                text-align: right;
            }
        }
        &:hover {
            background-color: var(--bg-row-hover);
            box-shadow: rgba(99, 99, 99, .2) 0 4px 12px 0;
        }
    }
    @media screen and (min-width: 768px) {
        .wallet {
            font-size: 16px;
            td.actions {
                display: table-cell;
            }
        }
    }
</style>

<script>
    import portfolioTokens from '$lib/stores/portfolioTokens';
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
    export let hidden;

    let ls;
    let doc;

    const hide = () => {
        if (!!ls) {
            if (ls.getItem(`arbucks::v0:hidden`) !== null) {
                try {
                    ls.setItem(`arbucks::v0:hidden`, JSON.stringify([address].concat(JSON.parse(ls.getItem(`arbucks::v0:hidden`)))));
                    hidden = `true`;
                    let newTokens = $portfolioTokens;
                    newTokens[newTokens.indexOf((newTokens.find((e) => e.address === address)))].hidden = `true`;
                    portfolioTokens.update(() => newTokens);
                } catch (e) {
                    ls.setItem(`arbucks::v0:hidden`, JSON.stringify([address]));
                    hidden = `true`;
                    let newTokens = $portfolioTokens;
                    newTokens[newTokens.indexOf((newTokens.find((e) => e.address === address)))].hidden = `true`;
                    portfolioTokens.update(() => newTokens);
                }
            } else {
                ls.setItem(`arbucks::v0:hidden`, JSON.stringify([address]));
                hidden = `true`;
                let newTokens = $portfolioTokens;
                newTokens[newTokens.indexOf((newTokens.find((e) => e.address === address)))].hidden = `true`;
                portfolioTokens.update(() => newTokens);
            }
        }
    };

    const show = () => {
        if (!!ls) {
            if (ls.getItem(`arbucks::v0:hidden`) !== null) {
                try {
                    ls.setItem(`arbucks::v0:hidden`, JSON.stringify(JSON.parse(ls.getItem(`arbucks::v0:hidden`))).splice(JSON.parse(ls.getItem(`arbucks::v0:hidden`)).indexOf(address), 1));
                    hidden = `false`;
                    let newTokens = $portfolioTokens;
                    newTokens[newTokens.indexOf((newTokens.find((e) => e.address === address)))].hidden = `false`;
                    portfolioTokens.update(() => newTokens);
                } catch (e) {
                    ls.setItem(`arbucks::v0:hidden`, JSON.stringify([]));
                    hidden = `false`;
                    let newTokens = $portfolioTokens;
                    newTokens[newTokens.indexOf((newTokens.find((e) => e.address === address)))].hidden = `false`;
                    portfolioTokens.update(() => newTokens);
                }
            } else {
                ls.setItem(`arbucks::v0:hidden`, JSON.stringify([]));
                hidden = `false`;
                let newTokens = $portfolioTokens;
                newTokens[newTokens.indexOf((newTokens.find((e) => e.address === address)))].hidden = `false`;
                portfolioTokens.update(() => newTokens);
            }
        }
    };

    onMount(() => {
        typeof localStorage !== `undefined` && (ls = localStorage);
        doc = document;
    });
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
    <td>
        {holdings[0].close.balance / (10 ** decimals)}
    </td>
    <td>
        {new Intl.NumberFormat(`en-US`, {
        currency: `USD`,
        style: 'currency',
        }).format(price)}
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
        {#if hidden === `false`}
            <button class="visibility" on:click={hide} title="Hide Token">
                <svg version="1.1" x="0px" y="0px" width="18px" viewBox="0 0 122.879 79.699" enable-background="new 0 0 122.879 79.699" xml:space="preserve">
                    <g>
                        <path fill="#fff" d="M0.955,37.326c2.922-3.528,5.981-6.739,9.151-9.625C24.441,14.654,41.462,7.684,59.01,7.334 c6.561-0.131,13.185,0.665,19.757,2.416l-5.904,5.904c-4.581-0.916-9.168-1.324-13.714-1.233 c-15.811,0.316-31.215,6.657-44.262,18.533l0,0c-2.324,2.115-4.562,4.39-6.702,6.82c4.071,4.721,8.6,8.801,13.452,12.227 c2.988,2.111,6.097,3.973,9.296,5.586l-5.262,5.262c-2.782-1.504-5.494-3.184-8.12-5.039c-6.143-4.338-11.813-9.629-16.78-15.85 C-0.338,40.563-0.228,38.59,0.955,37.326L0.955,37.326L0.955,37.326z M96.03,0l5.893,5.893L28.119,79.699l-5.894-5.895L96.03,0 L96.03,0z M97.72,17.609c4.423,2.527,8.767,5.528,12.994,9.014c3.877,3.196,7.635,6.773,11.24,10.735 c1.163,1.277,1.22,3.171,0.226,4.507c-4.131,5.834-8.876,10.816-14.069,14.963C95.119,67.199,79.338,72.305,63.352,72.377 c-6.114,0.027-9.798-3.141-15.825-4.576l3.545-3.543c4.065,0.705,8.167,1.049,12.252,1.031c14.421-0.064,28.653-4.668,40.366-14.02 c3.998-3.191,7.706-6.939,11.028-11.254c-2.787-2.905-5.627-5.543-8.508-7.918c-4.455-3.673-9.042-6.759-13.707-9.273L97.72,17.609 L97.72,17.609z M61.44,18.143c2.664,0,5.216,0.481,7.576,1.359l-5.689,5.689c-0.619-0.079-1.248-0.119-1.886-0.119 c-4.081,0-7.775,1.654-10.449,4.328c-2.674,2.674-4.328,6.369-4.328,10.45c0,0.639,0.04,1.268,0.119,1.885l-5.689,5.691 c-0.879-2.359-1.359-4.912-1.359-7.576c0-5.995,2.43-11.42,6.358-15.349C50.02,20.572,55.446,18.143,61.44,18.143L61.44,18.143z M82.113,33.216c0.67,2.09,1.032,4.32,1.032,6.634c0,5.994-2.43,11.42-6.357,15.348c-3.929,3.928-9.355,6.357-15.348,6.357 c-2.313,0-4.542-0.361-6.633-1.033l5.914-5.914c0.238,0.012,0.478,0.018,0.719,0.018c4.081,0,7.775-1.652,10.449-4.326 s4.328-6.369,4.328-10.449c0-0.241-0.006-0.48-0.018-0.72L82.113,33.216L82.113,33.216z"></path>
                    </g>
                </svg>
            </button>
        {:else}
            <button class="visibility" on:click={show} title="Show Token">
                <svg version="1.1" x="0px" y="0px" width="18px" viewBox="0 0 122.88 65.06" style="enable-background:new 0 0 122.88 65.06" xml:space="preserve">
                    <g>
                        <path fill="#fff" d="M0.95,30.01c2.92-3.53,5.98-6.74,9.15-9.63C24.44,7.33,41.46,0.36,59.01,0.01c17.51-0.35,35.47,5.9,51.7,19.29 c3.88,3.2,7.63,6.77,11.24,10.74c1.16,1.28,1.22,3.17,0.23,4.51c-4.13,5.83-8.88,10.82-14.07,14.96 C95.12,59.88,79.34,64.98,63.35,65.06c-15.93,0.07-32.06-4.86-45.8-14.57c-6.14-4.34-11.81-9.63-16.78-15.85 C-0.34,33.24-0.23,31.27,0.95,30.01L0.95,30.01z M61.44,26.46c0.59,0,1.17,0.09,1.71,0.24c-0.46,0.5-0.73,1.17-0.73,1.9 c0,1.56,1.26,2.82,2.82,2.82c0.77,0,1.46-0.3,1.97-0.8c0.2,0.6,0.3,1.24,0.3,1.9c0,3.35-2.72,6.07-6.07,6.07 c-3.35,0-6.07-2.72-6.07-6.07C55.37,29.18,58.09,26.46,61.44,26.46L61.44,26.46z M61.44,10.82c5.99,0,11.42,2.43,15.35,6.36 c3.93,3.93,6.36,9.35,6.36,15.35c0,5.99-2.43,11.42-6.36,15.35c-3.93,3.93-9.35,6.36-15.35,6.36c-5.99,0-11.42-2.43-15.35-6.36 c-3.93-3.93-6.36-9.35-6.36-15.35c0-5.99,2.43-11.42,6.36-15.35C50.02,13.25,55.45,10.82,61.44,10.82L61.44,10.82z M71.89,22.08 c-2.67-2.67-6.37-4.33-10.45-4.33c-4.08,0-7.78,1.65-10.45,4.33c-2.67,2.67-4.33,6.37-4.33,10.45c0,4.08,1.65,7.78,4.33,10.45 c2.67,2.67,6.37,4.33,10.45,4.33c4.08,0,7.78-1.65,10.45-4.33c2.67-2.67,4.33-6.37,4.33-10.45C76.22,28.45,74.56,24.75,71.89,22.08 L71.89,22.08z M14.89,25.63c-2.32,2.11-4.56,4.39-6.7,6.82c4.07,4.72,8.6,8.8,13.45,12.23c12.54,8.85,27.21,13.35,41.69,13.29 c14.42-0.07,28.65-4.67,40.37-14.02c4-3.19,7.7-6.94,11.03-11.25c-2.79-2.91-5.63-5.54-8.51-7.92C91.33,12.51,75,6.79,59.15,7.1 C43.34,7.42,27.93,13.76,14.89,25.63L14.89,25.63z"></path>
                    </g>
                </svg>
            </button>
        {/if}
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
                justify-content: flex-start;
                text-align: center;
                .visibility {
                    background-color: transparent;
                    border: 0;
                    cursor: pointer;
                    margin-left: 4px;
                    outline: none;
                    padding: 0;
                    will-change: opacity;
                    &:hover {
                        opacity: .8;
                    }
                }
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

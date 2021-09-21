<script>
    import { onMount } from 'svelte';
    import { defaultChainStore, web3, selectedAccount, connected, chainData } from 'svelte-web3';
    import wallet from '$lib/stores/wallet';
    import ripple from '$lib/services/ripple';
    import Copy from '$lib/components/Copy/index.svelte';

    export let tokenOneSymbol;
    export let tokenTwoSymbol;
    export let pairAddress;
    export let tokenOneAddress;
    export let tokenTwoAddress;

    let doc;
    let tab = `buy`;

    const updateBalance = async () => {
        if ($wallet !== ``) {
            /* A more reliable and decentralized solution for fetching data is a high-priority upcoming feature. */
            const COVALENT_KEY = `ckey_f02916bdd2b04038bc0808fb3bc`;
            const timestamp = Math.floor(new Date().getTime() / 1000);
            const history = await fetch(`https://api.covalenthq.com/v1/42161/address/${$wallet}/portfolio_v2/?key=${COVALENT_KEY}`);
            const jsonHistory = await history.json();
            jsonHistory.items.forEach((item) => item.contract_address === `0xafd871f684f21ab9d7137608c71808f83d75e6fc` && (balance = (item.holdings[0].close.balance)) / (10 ** 18));
        }
    };

    const connect = async () => {
        if (typeof document !== `undefined`) {
            if (typeof window.ethereum !== `undefined`) {
                defaultChainStore.setBrowserProvider();
                const currentAccounts = await window.ethereum.request({ method: `eth_requestAccounts`, });
                wallet.update(() => currentAccounts[0]);
                updateBalance();
            } else {
                alert(`You must have a web3-enabled Ethereum wallet like Metamask to do this!`);
            }
        }
    };

    const switchNetwork = () => {};

    const tabBuy = (e) => {
        ripple(e, doc);
        tab = `buy`;
    };

    const tabSell = (e) => {
        ripple(e, doc);
        tab = `sell`;
    };

    const placeOrder = (e) => {
        ripple(e, doc);
    };

    onMount(() => {
        doc = document;
        if (typeof window.ethereum !== `undefined`) {
            window.ethereum.on(`accountsChanged`, (newAccounts) => {
                wallet.update(() => newAccounts[0]);
                updateBalance();
            });
            console.log($chainData);
        }
    });
</script>


<div class="panel">
    <div class="panel__tabs" role="tablist">
        <div class="panel__tabs__tab" role="tab" aria-selected="{tab === `buy` ? `true` : `false`}" on:click={tabBuy}>
            Buy {tokenOneSymbol}
        </div>
        <div class="panel__tabs__tab" role="tab" aria-selected="{tab === `sell` ? `true` : `false`}" on:click={tabSell}>
            Sell {tokenOneSymbol}
        </div>
    </div>
    {#if tab === `buy`}
        <label for="from" class="panel__label">Amount ({tokenTwoSymbol})</label>
        <input id="from" class="panel__input" type="text">
        <label for="to" class="panel__label">Amount ({tokenOneSymbol})</label>
        <input id="to" class="panel__input" type="text">
    {:else}
        <label for="from" class="panel__label">Amount ({tokenOneSymbol})</label>
        <input id="from" class="panel__input" type="text">
        <label for="to" class="panel__label">Amount ({tokenTwoSymbol})</label>
        <input id="to" class="panel__input" type="text">
    {/if}
    <label for="slippage" class="panel__label">Slippage Tolerance</label>
    <input id="slippage" class="panel__input" type="text">
    <div class="panel__flex">
        <span>Disable Multihops</span>
        <label for="multihops" class="panel__switch">
            <div>
                <input id="multihops" type="checkbox">
                <span class="panel__switch__bubble"></span>
            </div>
        </label>
    </div>
    <div class="panel__flex">
        <span>Exchange</span>
        <span>Sushiswap V2</span>
    </div>
    <div class="panel__flex">
        <span>Liquidity</span>
        <span>Unavailable</span>
    </div>
    <div class="panel__flex">
        <span>Route</span>
        <span>Unavailable</span>
    </div>
    <div class="panel__flex">
        <span>Min. Received</span>
        <span>0.00</span>
    </div>
    <div class="panel__flex">
        <span>Price Impact</span>
        <span>0.00%</span>
    </div>
    <div class="panel__flex">
        <span>Wallet</span>
        {#if $wallet === ``}
            <span>Not Connected</span>
        {:else}
            <span>{$wallet.substring(0, 6)}... <Copy text={$wallet} small="true" /></span>
        {/if}
    </div>
    {#if $wallet === ``}
        <button class="panel__button" on:click={connect}>Connect Wallet</button>
    {:else}
        {#if $chainData.chainId !== 42161}
            <button class="panel__button" on:click={switchNetwork}>Switch to Arbitrum One</button>
        {:else}
            <button class="panel__button" on:click={placeOrder}>COMING SOON!</button>
        {/if}
    {/if}
</div>

<style>
    .panel {
        background-color: #000;
        border: 0;
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, .45) 0 25px 20px -20px;
        display: none;
        height: 400px;
        width: 100%;
        .panel__tabs {
            align-items: center;
            display: flex;
            height: 40px;
            justify-content: space-between;
            margin-top: 4px;
            .panel__tabs__tab {
                align-items: center;
                cursor: pointer;
                display: flex;
                font-size: 14px;
                font-weight: 600;
                height: 100%;
                margin-bottom: 8px;
                justify-content: center;
                overflow: hidden;
                position: relative;
                text-align: center;
                user-select: none;
                width: 100%;
                &:first-child {
                    color: #02c77a;
                    &[aria-selected="true"] {
                        border-bottom: 2px solid #02c77a;
                    }
                }
                &:last-child {
                    color: #ff3b69;
                    &[aria-selected="true"] {
                        border-bottom: 2px solid #ff3b69;
                    }
                }
                &:hover {
                    background-color: #0a0a0a;
                }
            }
        }
        .panel__label {
            color: #fafafa;
            font-size: 12px;
            margin: 8px 16px;
        }
        .panel__input {
            background-color: transparent;
            border: 1px solid #444;
            border-width: 0 0 1px 0;
            color: #fff;
            font-size: 18px;
            height: 60px;
            margin: 8px 16px;
            outline: none;
            transition: all .1s;
            width: calc(100% - 32px);
            will-change: border-color;
            &:hover {
                border-color: #666;
            }
            &:focus {
                border-color: #888;
            }
        }
        .panel__flex {
            align-items: center;
            color: #fafafa;
            display: flex;
            font-size: 12px;
            height: 20px;
            justify-content: space-between;
            margin: 8px 16px;
        }
        .panel__switch {
            display: inline-block;
            height: 20px;
            position: relative;
            width: 60px;
            input {
                height: 0;
                opacity: 0;
                width: 0;
                &:checked + .panel__switch__bubble {
                    background-color: var(--fg-link);
                    &:before {
                        background-color: #fff;
                        transform: translateX(40px);
                    }
                }
                &:focus + .panel__switch__bubble {
                    box-shadow: 0 0 2px var(--fg-link);
                }
            }
            .panel__switch__bubble {
                background-color: #222;
                border-radius: 20px;
                bottom: 0;
                cursor: pointer;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                transition: all .1s;
                &:before {
                    background-color: #888;
                    border-radius: 50%;
                    bottom: 4px;
                    content: '';
                    height: 12px;
                    left: 4px;
                    position: absolute;
                    transition: all .1s;
                    width: 12px;
                    will-change: background-color, box-shadow, transform;
                }
            }
        }
        .panel__button {
            background-color: #0a0a0a;
            border: 0;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            height: 34px;
            margin: 8px 16px;
            overflow: hidden;
            outline: none;
            padding: 6px;
            position: relative;
            transition: all .1s;
            width: calc(100% - 32px);
            will-change: background-color;
            &:hover {
                background-color: #111;
            }
        }
    }
    @media screen and (min-width: 1024px) {
        .panel {
            display: block;
            height: 600px;
            max-width: 300px;
            width: 100%;
        }
    }
</style>

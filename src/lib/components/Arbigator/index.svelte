<script>
    import { onMount } from 'svelte';
    import { defaultChainStore, web3, selectedAccount, connected, chainData } from 'svelte-web3';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from '@smui/button';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text/index';
    import FormField from '@smui/form-field';
    import Slider from '@smui/slider';
    import Switch from '@smui/switch';
    import Copy from '$lib/components/Copy/index.svelte';
    import Snackbar from '@smui/snackbar';

    let active = `buy`;

    export let tokenOneSymbol;
    export let tokenTwoSymbol;
    export let pairAddress;
    export let pairLiquidity;
    export let tokenOneAddress;
    export let tokenTwoAddress;
    export let tokenOneDecimals;
    export let tokenTwoDecimals;

    let doc;
    let tab = `buy`;
    let snackbar;

    let amountBase = 0;
    let amountQuote = 0;
    let slippageTolerance = 0.5;

    let allowMultihops = true;

    let minReceived = 0;

    let balanceBase = 0;
    let balanceQuote = 0;

    let tokenOneAllowance = 0;
    let tokenTwoAllowance = 0;

    let tokenOneReserve = 0;
    let tokenTwoReserve = 0;

    let approving = false;
    let swapping = false;

    const resetAmounts = () => {
        amountBase = 0;
        amountQuote = 0;
    };

    const getDecimals = async () => {
        const reqPair = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=${pairAddress}&chainID=42161`);
        const jsonPair = await reqPair.json();
        if (typeof jsonPair.error === `undefined`) {
            tokenOneDecimals = jsonPair[0].Token_1_decimals;
            tokenTwoDecimals = jsonPair[0].Token_2_decimals;
        }
    };

    const getReserves = async () => {
        if (!!$connected) {
            const reqPair = await fetch(`https://api2.sushipro.io/?action=get_pair&pair=${pairAddress}&chainID=42161`);
            const jsonPair = await reqPair.json();
            if (typeof jsonPair.error === `undefined`) {
                tokenOneReserve = jsonPair[0].Token_1_reserve;
                tokenTwoReserve = jsonPair[0].Token_2_reserve;
            }
        }
    };

    const getBase = () => {
        if (active === `sell`) {
            if (tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                const amountIn = (tokenTwoReserve * (10 ** tokenTwoDecimals)) * 1000;
                const amountOut = (tokenOneReserve * (10 ** tokenOneDecimals));
                const adjustedInput = parseFloat(amountQuote) * (10 ** tokenTwoDecimals);
                amountBase = (adjustedInput * 997 * amountOut) / (amountIn + (adjustedInput * 997)) / (10 ** tokenOneDecimals);
                minReceived = amountBase - ((amountBase / 100) * slippageTolerance);
            } else {
                const amountIn = (tokenTwoReserve * (10 ** tokenOneDecimals)) * 1000;
                const amountOut = (tokenOneReserve * (10 ** tokenTwoDecimals));
                const adjustedInput = parseFloat(amountQuote) * (10 ** tokenOneDecimals);
                amountBase = (adjustedInput * 997 * amountIn) / (amountOut + (adjustedInput * 997)) / (10 ** tokenTwoDecimals);
                minReceived = amountBase - ((amountBase / 100) * slippageTolerance);
            }
            if (!!isNaN(amountBase)) {
                amountBase = 0;
                minReceived = 0;
            }
        }
    };

    const getQuote = () => {
        if (active === `buy`) {
            if (tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                const amountIn = (tokenOneReserve * (10 ** tokenOneDecimals)) * 1000;
                const amountOut = (tokenTwoReserve * (10 ** tokenTwoDecimals));
                const adjustedInput = parseFloat(amountBase) * (10 ** tokenOneDecimals);
                amountQuote = (adjustedInput * 997 * amountOut) / (amountIn + (adjustedInput * 997)) / (10 ** tokenTwoDecimals);
                minReceived = amountQuote - ((amountQuote / 100) * slippageTolerance);
            } else {
                const amountIn = (tokenTwoReserve * (10 ** tokenTwoDecimals)) * 1000;
                const amountOut = (tokenOneReserve * (10 ** tokenOneDecimals));
                const adjustedInput = parseFloat(amountBase) * (10 ** tokenTwoDecimals);
                amountQuote = (adjustedInput * 997 * amountIn) / (amountOut + (adjustedInput * 997)) / (10 ** tokenOneDecimals);
                minReceived = amountQuote - ((amountQuote / 100) * slippageTolerance);
            }
            if (!!isNaN(amountQuote)) {
                amountQuote = 0;
                minReceived = 0;
            }
        }
    };

    const abiBalance = [
        {
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
        }
    ];
    const abiAllowance = [
        {
            "constant": true,
            "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }],
            "name": "allowance",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "type": "function"
        }
    ];

    const switchNetwork = () => {}; // TODO

    const encodeApproval = () => {
        return $web3.eth.abi.encodeFunctionCall(
            {
                inputs: [
                    {
                        name: `spender`,
                        type: `address`,
                    },
                    {
                        name: `rawAmount`,
                        type: `uint256`,
                    },
                ],
                name: `approve`,
                type: `function`,
            },
            [
                pairAddress,
                `115792089237316195423570985008687907853269984665640564039457584007913129639935`
            ]
        );
    };

    const encodeSwap = (amountIn, amountOut, decimalInput, decimalOutput, tokens) => {
        const timeout = Math.floor(Date.now() / 1000) + 1800; // 30 minutes is default tx timeout
        return $web3.eth.abi.encodeFunctionCall(
            {
                inputs: [
                    {
                        name: `amountIn`,
                        type: `uint256`,
                    },
                    {
                        name: `amountOutMin`,
                        type: `uint256`,
                    },
                    {
                        name: `path`,
                        type: `address[]`,
                    },
                    {
                        name: `to`,
                        type: `address`,
                    },
                    {
                        name: `deadline`,
                        type: `uint256`,
                    },
                ],
                name: `swapExactTokensForTokens`,
                type: `function`,
            },
            [
                $web3.utils.toWei(amountIn.toFixed(decimalInput).toString(), getWei(decimalInput)),
                $web3.utils.toWei(amountOut.toFixed(decimalOutput).toString(), getWei(decimalOutput)),
                tokens,
                $selectedAccount.toString(),
                timeout,
            ]
        );
    };

    const getAllowance = async (tokenAddress) => {
        const contract = await new $web3.eth.Contract(abiAllowance, tokenAddress.toString());
        return await contract.methods.allowance($selectedAccount.toString(), pairAddress.toString()).call();
    };

    const updateAllowance = async () => {
        tokenOneAllowance = await getAllowance(tokenOneAddress);
        tokenTwoAllowance = await getAllowance(tokenTwoAddress);
        return active === `buy` ? tokenTwoAllowance : tokenOneAllowance;
    };

    const updateBalance = async () => {
        if (!!$connected && !!$selectedAccount && $chainData.chainId === 42161) {
            const contractOne = new $web3.eth.Contract(abiBalance, tokenOneAddress);
            const contractTwo = new $web3.eth.Contract(abiBalance, tokenTwoAddress);
            const balanceOne = await contractOne.methods.balanceOf($selectedAccount).call();
            const balanceTwo = await contractTwo.methods.balanceOf($selectedAccount).call();
            if (tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                balanceBase = balanceOne / (10 ** tokenOneDecimals); // TODO make sure not to divide by 0
                balanceQuote = balanceTwo / (10 ** tokenTwoDecimals); // TODO make sure not to divide by 0
            } else {
                balanceBase = balanceTwo / (10 ** tokenTwoDecimals); // TODO make sure not to divide by 0
                balanceQuote = balanceOne / (10 ** tokenOneDecimals); // TODO make sure not to divide by 0
            }
        }
    };

    const getWei = (decimals) => {
        let wei = `ether`;
        switch (parseInt(decimals)) {
            case 0:
                wei = `noether`;
                break;
            case 1:
                wei = `wei`;
                break;
            case 2:
                wei = `two`;
                break;
            case 3:
                wei = `kwei`;
                break;
            case 4:
                wei = `four`;
                break;
            case 5:
                wei = `five`;
                break;
            case 6:
                wei = `mwei`;
                break;
            case 7:
                wei = `seven`;
                break;
            case 8:
                wei = `eight`;
                break;
            case 9:
                wei = `gwei`;
                break;
            case 10:
                wei = `ten`;
                break;
            case 11:
                wei = `eleven`;
                break;
            case 12:
                wei = `microether`;
                break;
            case 15:
                wei = `milliether`;
                break;
            case 18:
                wei = `ether`;
                break;
            case 21:
                wei = `kether`;
                break;
            case 24:
                wei = `mether`;
                break;
            case 27:
                wei = `gether`;
                break;
            case 30:
                wei = `tether`;
                break;
            default:
                wei = `ether`;
        }
        return wei;
    };

    const placeOrder = async () => {
        let amountIn;
        let amountOut;
        let tokenInput;
        let tokenOutput;
        let decimalInput;
        let decimalOutput;
        if (active === `buy`) {
            amountIn = parseFloat(amountBase);
            amountOut = parseFloat(amountQuote);
            tokenInput = tokenOneAddress;
            tokenOutput = tokenTwoAddress;
            decimalInput = tokenOneDecimals;
            decimalOutput = tokenTwoDecimals;
        } else {
            amountIn = parseFloat(amountQuote);
            amountOut = parseFloat(amountBase);
            tokenInput = tokenTwoAddress;
            tokenOutput = tokenOneAddress;
            decimalInput = tokenTwoDecimals;
            decimalOutput = tokenOneDecimals;
        }

        const allowance = await updateAllowance();

        minReceived = amountOut - ((amountOut / 100) * slippageTolerance);

        if (allowance == 0) {
            const data = encodeApproval();
            $web3.eth.estimateGas({
                data,
                from: $selectedAccount,
                to: tokenInput.toString(),
            }).then((estimatedGas) => {
                const gasLimit = (parseInt(estimatedGas) + (parseInt(estimatedGas) / 10)).toFixed(0);
                $web3.eth.sendTransaction({
                    data,
                    from: $selectedAccount,
                    gas: gasLimit,
                    gasPrice: $web3.utils.toWei(`1.2`, `Gwei`),
                    to: tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1` ? tokenInput.toString() : tokenOutput.toString(),
                }).once(`error`, () => {
                    approving = false;
                    snackbar.open();
                }).once(`transactionHash`, () => {
                    approving = true;
                }).once(`receipt`, async (receipt) => {
                    approving = false;
                    await updateAllowance();
                });
            }).catch((error) => {
                // RPC ERROR
                snackbar.open();
            });
        } else {
            const data = tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`
                ? encodeSwap(amountIn, minReceived, decimalOutput, decimalInput, [tokenOutput, tokenInput].reverse())
                : encodeSwap(amountIn, minReceived, decimalOutput, decimalInput, [tokenOutput, tokenInput]);
            $web3.eth.estimateGas({
                data,
                from: $selectedAccount,
                to: `0x1b02da8cb0d097eb8d57a175b88c7d8b47997506`,
            }).then((estimatedGas) => {
                const gasLimit = (parseInt(estimatedGas) + (parseInt(estimatedGas) / 10)).toFixed(0);
                $web3.eth.sendTransaction({
                    data,
                    from: $selectedAccount,
                    gas: gasLimit,
                    gasPrice: $web3.utils.toWei(`1.2`, `Gwei`),
                    to: `0x1b02da8cb0d097eb8d57a175b88c7d8b47997506`,
                }).once(`error`, () => {
                    swapping = false;
                    snackbar.open();
                }).once(`transactionHash`, () => {
                    swapping = true;
                }).once(`receipt`, async (receipt) => {
                    swapping = false;
                    await updateBalance();
                    await updateAllowance();
                });
            }).catch((error) => {
                // RPC ERROR
                snackbar.open();
            });
        }
    };

    const connect = () => {
        if (!!doc) {
            if (typeof window.ethereum !== `undefined`) {
                defaultChainStore.setBrowserProvider();
                setTimeout(async () => {
                    await updateBalance();
                    await updateAllowance();
                }, 1000);
            } else {
                alert(`You must have a web3-enabled Ethereum wallet like Metamask to do this!`);
            }
        }
    };

    const styleTextfield = `min-width: 100px; width: 100%;`;
    const styleFormfield = `display: flex; width: 100%;`;
    const styleSlider = `flex-grow: 1; margin: 0; width: 100%;`;
    const styleButton = `margin-top: 16px; overflow: hidden; position: relative; width: 100%;`;

    onMount(() => {
        doc = document;
        getReserves();
        getDecimals();
        if (typeof window.ethereum !== `undefined`) {
            window.ethereum.on(`accountsChanged`, async (newAccounts) => {
                await updateBalance();
                await updateAllowance();
            });
            (!!$connected && !!$selectedAccount) && (connect());
        }
        setInterval(() => getReserves(), 5000);
    });

    $: active, resetAmounts();
    $: amountBase, getQuote();
    $: amountQuote, getBase();
    $: allowMultihops, allowMultihops === false && (alert(`This feature is still a WIP and transactions may go through multiple hops even with this setting disabled.`));
</script>

<div class="panel">
    <div>
        <TabBar tabs={[`buy`, `sell`]} let:tab bind:active>
            <Tab {tab}>
                <Label>{tab} {tokenOneSymbol}</Label>
            </Tab>
        </TabBar>
    </div>
    {#if active === `buy`}
        <div class="panel__flex panel__flex--tall">
            <Textfield type="text" bind:value={amountBase} label="Amount ({tokenTwoSymbol})" style={styleTextfield} />
        </div>
        <div class="panel__flex">
            <p><small>Balance: <strong>{balanceBase}</strong></small></p>
        </div>
        <div class="panel__flex panel__flex--tall">
            <Textfield type="text" bind:value={amountQuote} label="Amount ({tokenOneSymbol})" style={styleTextfield} />
        </div>
        <div class="panel__flex">
            <p><small>Balance: <strong>{balanceQuote}</strong></small></p>
        </div>
        <div class="panel__flex panel__flex--tall">
            <FormField align="end" style={styleFormfield}>
                {#if !!$connected && $chainData.chainId === 42161 && balanceBase > 0}
                    <Slider style={styleSlider} min="0" max={balanceBase} step={1 / (10 ** tokenOneDecimals)} bind:value={amountBase} discrete input$aria-label="Discrete Slider" />
                {:else}
                    <Slider disabled style={styleSlider} min="0" max="100" value="0" />
                {/if}
            </FormField>
            <div>
                {#if !!$connected && $chainData.chainId === 42161 && balanceBase > 0}
                    <Button on:click={() => (amountBase = balanceBase)}>Max</Button>
                {:else}
                    <Button disabled>Max</Button>
                {/if}
            </div>
        </div>
        <div class="panel__flex panel__flex--tall">
            <Textfield type="text" bind:value={slippageTolerance} label="Slippage Tolerance (%)" style={styleTextfield} />
            <div>
                <FormField>
                    <Switch color="primary" bind:checked={allowMultihops} />
                    <span slot="label">Multihops</span>
                </FormField>
            </div>
        </div>
    {:else}
        <div class="panel__flex panel__flex--tall">
            <Textfield type="text" bind:value={amountQuote} label="Amount ({tokenOneSymbol})" style={styleTextfield} />
        </div>
        <div class="panel__flex">
            <p><small>Balance: <strong>{balanceQuote}</strong></small></p>
        </div>
        <div class="panel__flex panel__flex--tall">
            <Textfield type="text" bind:value={amountBase} label="Amount ({tokenTwoSymbol})" style={styleTextfield} />
        </div>
        <div class="panel__flex">
            <p><small>Balance: <strong>{balanceBase}</strong></small></p>
        </div>
        <div class="panel__flex panel__flex--tall">
            <FormField align="end" style={styleFormfield}>
                {#if !!$connected && $chainData.chainId === 42161 && balanceQuote > 0}
                    <Slider style={styleSlider} min="0" max={balanceQuote} step={1 / (10 ** tokenTwoDecimals)} bind:value={amountQuote} discrete input$aria-label="Discrete Slider" />
                {:else}
                    <Slider disabled style={styleSlider} min="0" max="100" value="0" />
                {/if}
            </FormField>
            <div>
                {#if !!$connected && $chainData.chainId === 42161 && balanceQuote > 0}
                    <Button on:click={() => (amountQuote = balanceQuote)}>Max</Button>
                {:else}
                    <Button disabled>Max</Button>
                {/if}
            </div>
        </div>
        <div class="panel__flex panel__flex--tall">
            <Textfield type="text" bind:value={slippageTolerance} label="Slippage Tolerance (%)" style={styleTextfield} />
            <div>
                <FormField>
                    <Switch color="primary" bind:checked={allowMultihops} />
                    <span slot="label">Multihops</span>
                </FormField>
            </div>
        </div>
    {/if}
    <div class="panel__flex">
        <span>Exchange</span>
        <span>Sushiswap V2</span>
    </div>
    <div class="panel__flex">
        <span>Liquidity</span>
        <span>~{pairLiquidity}</span>
    </div>
    <div class="panel__flex">
        <span>Min. Received</span>
        <span>{minReceived}</span>
    </div>
    <div class="panel__flex">
        <span>Wallet</span>
        {#if !$connected}
            <span>Not Connected</span>
        {:else}
            <span>{$selectedAccount.substring(0, 6)}...
                <Copy text={$selectedAccount} small="true" />
            </span>
        {/if}
    </div>
    <div class="panel__flex">
        {#if !$connected}
            <Button on:click={connect} variant="raised" style={styleButton}>
                <Label>Connect Wallet</Label>
            </Button>
        {:else}
            {#if $chainData.chainId !== 42161}
                <Button on:click={switchNetwork} variant="raised" style={styleButton}>
                    <Label>Switch to Arbitrum One</Label>
                </Button>
            {:else}
                {#if tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`}
                    {#if (active === `buy` && (amountBase > balanceBase || balanceBase === 0)) || (active === `sell` && (amountQuote > balanceQuote || balanceQuote === 0))}
                        <Button disabled variant="raised" style={styleButton}>
                            <Label>Insufficient Balance</Label>
                        </Button>
                    {:else}
                        {#if (active === `buy` && tokenTwoAllowance == 0) || (active === `sell` && tokenOneAllowance == 0)}
                            {#if !!approving}
                                <Button variant="raised" style={styleButton}>
                                    <Label>Approving {active === `buy` ? tokenTwoSymbol : tokenOneSymbol}...</Label>
                                </Button>
                            {:else}
                                <Button on:click={placeOrder} variant="raised" style={styleButton}>
                                    <Label>Approve {active === `buy` ? tokenTwoSymbol : tokenOneSymbol}</Label>
                                </Button>
                            {/if}
                        {:else}
                            {#if amountBase <= 0}
                                <Button disabled variant="raised" style={styleButton}>
                                    <Label>Invalid Amount</Label>
                                </Button>
                            {:else}
                                {#if !!swapping}
                                    <Button variant="raised" style={styleButton}>
                                        <Label>Swapping...</Label>
                                    </Button>
                                {:else}
                                    <Button on:click={placeOrder} variant="raised" style={styleButton}>
                                        <Label>Place Order</Label>
                                    </Button>
                                {/if}
                            {/if}
                        {/if}
                    {/if}
                {:else}
                    {#if (active === `buy` && (amountBase > balanceBase || balanceBase === 0)) || (active === `sell` && (amountQuote > balanceQuote || balanceQuote === 0))}
                        <Button disabled variant="raised" style={styleButton}>
                            <Label>Insufficient Balance</Label>
                        </Button>
                    {:else}
                        {#if (active === `buy` && tokenTwoAllowance == 0) || (active === `sell` && tokenOneAllowance == 0)}
                            {#if !!approving}
                                <Button variant="raised" style={styleButton}>
                                    <Label>Approving {active === `buy` ? tokenTwoSymbol : tokenOneSymbol}...</Label>
                                </Button>
                            {:else}
                                <Button on:click={placeOrder} variant="raised" style={styleButton}>
                                    <Label>Approve {active === `buy` ? tokenTwoSymbol : tokenOneSymbol}</Label>
                                </Button>
                            {/if}
                        {:else}
                            {#if amountBase <= 0}
                                <Button disabled variant="raised" style={styleButton}>
                                    <Label>Invalid Amount</Label>
                                </Button>
                            {:else}
                                {#if !!swapping}
                                    <Button variant="raised" style={styleButton}>
                                        <Label>Swapping...</Label>
                                    </Button>
                                {:else}
                                    <Button on:click={placeOrder} variant="raised" style={styleButton}>
                                        <Label>Place Order</Label>
                                    </Button>
                                {/if}
                            {/if}
                        {/if}
                    {/if}
                {/if}
            {/if}
        {/if}
    </div>
    <div class="panel__flex panel__flex--tall">
        <p class="centered">
            <br>
            <br>
            <small>
                Arbigator is a DEX aggregator for Arbitrum. Get the best price with <em>no extra fees</em>. Gas limits are >200% lower than SushiSwap, with no extra slippage.
            </small>
        </p>
    </div>
</div>

<Snackbar bind:this={snackbar}>
    <Label>Transaction failed.</Label>
</Snackbar>

<style>
    .panel {
        background-color: var(--bg-soft);
        border: 0;
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, .45) 0 25px 20px -20px;
        height: 600px;
        margin: 40px auto 0;
        max-width: 300px;
        width: 100%;
        .panel__flex {
            align-items: center;
            color: var(--fg);
            display: flex;
            font-size: 12px;
            height: 20px;
            justify-content: space-between;
            margin: 8px 16px;
            &.panel__flex--tall {
                column-gap: 16px;
                height: 60px;
            }
        }
        .centered {
            text-align: center;
        }
    }
    @media screen and (min-width: 1024px) {
        .panel {
            border-radius: 0 8px 8px 0;
            height: 700px;
            margin-top: 0;
        }
    }
    :global {
        .mdc-slider__value-indicator-text {
            color: #fff !important;
        }
    }
</style>

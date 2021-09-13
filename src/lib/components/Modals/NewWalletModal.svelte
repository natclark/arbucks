<script>
    import confetti from 'canvas-confetti';
    import portfolioWallets from '$lib/stores/portfolioWallets';
    import { onMount } from 'svelte';

    export let close;

    let ls;

    let name = ``;
    let address = ``;

    const submit = () => {
        if (!!ls) {
            if (name !== `` && address !== ``) {
                const wallets = ls.getItem(`arbucks::v0:wallets`);
                if (ls.getItem(`arbucks::v0:wallets`) !== null) {
                    try {
                        ls.setItem(`arbucks::v0:wallets`, JSON.stringify(JSON.parse(wallets).concat({
                            name,
                            address,
                        })));
                    } catch (e) {
                        ls.setItem(`arbucks::v0:wallets`, JSON.stringify([
                            {
                                name,
                                address,
                            }
                        ]));
                    }
                } else {
                    ls.setItem(`arbucks::v0:wallets`, JSON.stringify([
                        {
                            name,
                            address,
                        }
                    ]));
                }
                confetti({
                    origin: {
                        y: .6,
                    },
                    particleCount: 100,
                    spread: 70,
                    zIndex: 1001,
                });
                portfolioWallets.update(() => JSON.parse(ls.getItem(`arbucks::v0:wallets`)));
                close();
            }
        } else {
            alert(`To use this feature, you must use a browser that supports localStorage!`);
        }
    };

    onMount(() => typeof localStorage !== `undefined` && (ls = localStorage));
</script>

<div class="input">
    <label>Name</label>
    <input bind:value={name} id="name" class="input__field" type="text" placeholder="My Epic Portfolio" required aria-required="true">
</div>
<div class="input">
    <label>Address</label>
    <input bind:value={address} id="address" class="input__field" type="text" placeholder="0xa1..." required aria-required="true">
</div>
<p><a class="button" draggable="false" role="button" on:click={submit}>Add Wallet</a></p>

<style>
    .input {
        display: block;
        margin: 32px 0;
        label {
            text-align: center;
            width: 100px;
        }
        .input__field {
            background-color: var(--bg-input);
            border: 0;
            border-radius: 24px;
            color: #fff;
            font-size: 1rem;
            letter-spacing: .2px;
            line-height: .75rem;
            text-shadow: 0 0 16px rgba(60, 100, 255, .2);
            outline: none;
            padding: .75rem;
            transition: all .08s ease-in;
            width: 80%;
            will-change: box-shadow;
            &::-ms-input-placeholder, &:-ms-input-placeholder, *::placeholder {
                color: #888;
            }
            &::placeholder {
                opacity: 1;
            }
            &:hover, &:focus, &:active {
                box-shadow: rgba(0, 0, 0, .4) 0 30px 90px;
            }
            &:focus {
                box-shadow: rgba(0, 0, 0, .16) 0 1px 4px, var(--fg-header) 0 0 0 2px;
            }
        }
    }
    .button {
        cursor: pointer;
        margin-bottom: 24px;
    }
    @media screen and (min-width: 768px) {
        .input {
            align-items: center;
            display: flex;
            justify-content: space-around;
            .input__field {
                width: 70%;
            }
        }
    }
</style>

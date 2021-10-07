<script>
    const click = () => {
        alert(`Arbucks Pro is coming soon. Stay tuned!`);
    };
</script>

<svelte:head>
    <title>Pro Membership - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/pro/">
    <meta property="og:title" content="Pro Membership - Arbucks">
    <meta name=twitter:title content="Pro Membership - Arbucks">
</svelte:head>

<div class="top">
    <h1>Arbucks Pro</h1>
    <p>Unlock premium features by staking BUCK-WETH liquidity.</p>
    <p><em>Coming soon!</em></p>
    <br>
</div>

<div class="flex">
    <div class="tier">
        <h2>Tier 1</h2>
        <p><strong>15 SLP Tokens</strong></p>
        <ul>
            <li><p>Multi-chart view</p></li>
            <li><p>Yield farm analytics</p></li>
            <li><p>NFT analytics</p></li>
            <li><p>Private Telegram group</p></li>
            <li><p>-</p></li>
            <li><p>-</p></li>
            <li><p>-</p></li>
        </ul>
        <div class="tier__button">
            <button class="secondary" draggable="false" on:click={click}>
                Stake SLP Tokens
            </button>
        </div>
    </div>
    <div class="tier">
        <h2>Tier 2</h2>
        <p><strong>80 SLP Tokens</strong></p>
        <ul>
            <li><p>Multi-chart view</p></li>
            <li><p>Yield farm analytics</p></li>
            <li><p>NFT analytics</p></li>
            <li><p>Private Telegram group</p></li>
            <li><p>Advanced portfolio tracking</p></li>
            <li><p>-</p></li>
            <li><p>-</p></li>
        </ul>
        <div class="tier__button">
            <button class="secondary" draggable="false" on:click={click}>
                Stake SLP Tokens
            </button>
        </div>
    </div>
    <div class="tier">
        <h2>Tier 3</h2>
        <p><strong>100 SLP Tokens</strong></p>
        <ul>
            <li><p>Multi-chart view</p></li>
            <li><p>Yield farm analytics</p></li>
            <li><p>NFT analytics</p></li>
            <li><p>Private Telegram group</p></li>
            <li><p>Advanced portfolio tracking</p></li>
            <li><p>Custom whale alerts</p></li>
            <li><p>Arbitrage scanner</p></li>
        </ul>
        <div class="tier__button">
            <button class="secondary" draggable="false" on:click={click}>
                Stake SLP Tokens
            </button>
        </div>
    </div>
</div>

<div class="top">
    <p>More information will follow shortly! Keep an eye on <a href="/blog/" sveltekit:prefetch>our blog</a>.</p>
    <p><em>Please note that perks may be subject to change following the launch of Arbucks Pro.</em></p>
</div>

<style>
    .top {
        text-align: center;
    }
    .flex {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 40px;
    }
    .tier {
        background-image: linear-gradient(#0d357f, #05437a);
        border-radius: 16px;
        box-shadow: rgba(0, 0, 0, .19) 0 10px 20px, rgba(0, 0, 0, .23) 0 6px 6px;
        margin-bottom: 40px;
        padding: 24px 0;
        width: 270px;
        text-align: center;
        h2 {
            margin: 0;
        }
        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            li {
                border-bottom: 1px solid #333;
                padding: 6px;
                &:first-child {
                    border-top: 1px solid #333;
                }
                &:last-child {
                    margin-bottom: calc(1em + 6px);
                }
            }
        }
        .tier__button {
            align-items: center;
            display: flex;
            justify-content: center;
            .secondary {
                align-items: center;
                background-color: var(--fg);
                border: 0;
                border-radius: 24px;
                cursor: pointer;
                display: flex;
                font-size: 16px;
                height: 30px;
                outline: none;
                padding: 8px 32px;
                transition: opacity .1s;
                will-change: opacity;
                &:hover {
                    opacity: .8;
                }
            }
        }
    }
    @media screen and (min-width: 768px) {
        .flex {
            flex-direction: row;
            justify-content: space-around;
        }
        .tier {
            margin-bottom: 0;
        }
    }
</style>

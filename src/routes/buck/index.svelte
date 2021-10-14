<script>
    import Copy from '$lib/components/Copy/index.svelte';
</script>

<svelte:head>
    <title>BUCK Token - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/buck/">
    <meta property="og:title" content="BUCK Token - Arbucks">
    <meta name=twitter:title content="BUCK Token - Arbucks">
</svelte:head>

<div class="wrapper">
    <div class="container">
        <div class="top">
            <h1 class="title">$BUCK</h1>
            <p class="subtitle">A fixed-supply, Arbitrum-native "blue chip" utility token.</p>
            <a class="primary" href="https://app.sushi.com/swap?outputCurrency=0xafd871f684f21ab9d7137608c71808f83d75e6fc" draggable="false" rel="external noopener" target="_blank">
                Swap on SushiSwap
            </a>
            <p><a href="https://arbiscan.io/token/0xafd871f684f21ab9d7137608c71808f83d75e6fc" draggable="false" rel="external noopener" target="_blank">0xafd871f684f21ab9d7137608c71808f83d75e6fc</a> <Copy text="0xafd871f684f21ab9d7137608c71808f83d75e6fc" /></p>
        </div>

        <ul>
            <li>Fixed supply of 100,000,000 (100M) $BUCK tokens</li>
            <li>Vested liquidity raised by a flash presale</li>
            <li>No transaction taxes</li>
        </ul>

        <p>For more details on tokenomics, see our <a href="/docs/token/" sveltekit:prefetch>documentation page</a>.</p>

        <h2>Utility</h2>

        <p>The utility of holding $BUCK tokens is currently threefold:</p>

        <h3>1. Arbazaar (WIP)</h3>

        <p>Arbazaar is a WIP Arbitrum-native NFT marketplace.</p>
        <p>$BUCK holders will be able to mint NFTs and list collections.</p>

        <h3>2. Arbucks Pro Membership (Coming Soon)</h3>

        <p>Arbucks Pro will provide premium features on this site.</p>

        <p>It can be unlocked by staking BUCK-WETH LP tokens.</p>

        <p>More information will be released shortly.</p>

        <p>Be sure to keep an eye on our <a href="/blog/" sveltekit:prefetch>blog</a>!</p>

        <h3>3. $BUCK Farming (Coming Soon)</h3>

        <p>Soon, holders will be able to stake their $BUCK tokens.</p>

        <p>$BUCK is a non-inflationary and fixed-supply token.</p>

        <p>Therefore, a new, separate, & TBA token will be farmed.</p>

        <h2>Around The Web</h2>

        <div class="flex flex--cards">
            <a class="card" href="https://www.coingecko.com/en/coins/arbucks" draggable="false" rel="external noopener" target="_blank">
                <img draggable="false" src="https://cloudflare-ipfs.com/ipfs/QmcP2gBPDXXAdSXtuypcsVhSHoatiRi3SBHS8qHeexPxW4" alt="CoinGecko Logo" loading="lazy">
                <p>CoinGecko</p>
            </a>
            <a class="card" href="https://coinmarketcap.com/currencies/arbucks/" draggable="false" rel="external noopener" target="_blank">
                <img draggable="false" src="https://cloudflare-ipfs.com/ipfs/QmQeHBsbXZX1i7SjEN5sVQWwkE34dQf4KpWGcJ1pHpnqrm" alt="CoinMarketCap Logo" loading="lazy">
                <p>CoinMarketCap</p>
            </a>
        </div>
    </div>
</div>

<br>
<br>

<style>
    .wrapper {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .container {
        max-width: 800px;
    }
    .top {
        text-align: center;
    }
    .primary {
        display: flex;
        height: 32px;
        justify-content: center;
        margin: 0 auto;
        max-width: 277px;
    }
    h2 {
        text-align: center;
    }
    h3 {
        text-align: left;
    }
    .flex {
        display: block;
        &.flex--cards {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            row-gap: 12px;
        }
    }
    .card {
        align-items: center;
        background-color: var(--bg-soft);
        border-radius: 16px;
        color: var(--fg);
        display: flex;
        flex-direction: column;
        height: 200px;
        justify-content: space-between;
        padding: 12px;
        text-align: center;
        width: 200px;
        img {
            width: 128px;
        }
    }
    @media screen and (min-width: 768px) {
        .flex.flex--cards {
            column-gap: 12px;
            flex-direction: row;
        }
    }
</style>

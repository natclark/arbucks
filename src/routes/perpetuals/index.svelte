<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One Perpetual Futures - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/perpetuals/">
    <meta property="og:title" content="Arbitrum One Perpetual Futures - Arbucks">
    <meta name=twitter:title content="Arbitrum One Perpetual Futures - Arbucks">
</svelte:head>

<h1>Arbitrum One Perpetual Futures</h1>
<p class="subtitle">These are some protocols that support perpetual futures trading on Arbitrum.</p>

<Columns>
    <Column>
        <div class="card">
            <h2>Cap</h2>
            <p>
                <a class="primary" href="https://cap.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>cBRIDGE (Celer Network)</h2>
            <p>
                <a class="primary" href="https://cbridge.celer.network/#/transfer" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Hop Exchange</h2>
            <p>
                <a class="primary" href="https://app.hop.exchange/send?token=USDT&destNetwork=arbitrum&sourceNetwork=ethereum" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>Mosaic (Composable Finance)</h2>
            <p>
                <a class="primary" href="https://mosaic.composable.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Futureswap</h2>
            <p>
                <a class="primary" href="https://www.futureswap.com/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>GMX</h2>
            <p>
                <a class="primary" href="https://gmx.io/" rel="external noopener" target="_blank" draggable="false">Visit
                    App</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>MCDex</h2>
            <p>
                <a class="primary" href="https://app.mcdex.io/trade/00001/?chainId=42161" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Perpetual Protocol</h2>
            <p>
                <a class="primary" href="https://www.perp.fi/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>SynFutures</h2>
            <p>
                <a class="primary" href="https://beta.synfutures.com/" rel="external noopener" target="_blank"
                    draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
</Columns>

<style>
    .card {
        background-color: var(--bg-soft);
        border-radius: 24px;
        text-align: center;
        padding: 20px 0;
        h2 {
            margin: 0;
        }
        p {
            display: flex;
            justify-content: center;
            margin-bottom: 6px;
        }
        .primary {
            height: 32px;
            justify-content: center;
            max-width: 200px;
        }
    }
</style>

<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One Bridges - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/bridges/">
    <meta property="og:title" content="Arbitrum One Bridges - Arbucks">
    <meta name=twitter:title content="Arbitrum One Bridges - Arbucks">
</svelte:head>

<h1>Arbitrum One Bridges</h1>
<p class="subtitle">Bridges are used for transferring assets between chains.</p>

<Columns>
    <Column>
        <div class="card">
            <h2>Arbitrum Bridge</h2>
            <p>
                <a class="primary" href="https://bridge.arbitrum.io/" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>cBRIDGE (Celer Network)</h2>
            <p>
                <a class="primary" href="https://cbridge.celer.network/#/transfer" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Hop Exchange</h2>
            <p>
                <a class="primary" href="https://app.hop.exchange/send?token=USDT&destNetwork=arbitrum&sourceNetwork=ethereum" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>Mosaic (Composable Finance)</h2>
            <p>
                <a class="primary" href="https://mosaic.composable.finance/" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>xPollinate V2 (Connext)</h2>
            <p>
                <a class="primary" href="https://xpollinate.io/?fromChain=137&fromToken=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&toChain=42161&toToken=0xff970a61a04b1ca14834a43f5de4533ebddb5cc8" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>AnySwap</h2>
            <p>
                <a class="primary" href="https://anyswap.exchange/dashboard#/router" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>RenBridge V2</h2>
            <p>
                <a class="primary" href="https://bridge.renproject.io/mint" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Synapse</h2>
            <p>
                <a class="primary" href="https://synapseprotocol.com/?inputCurrency=ETH&outputCurrency=ETH&outputChain=42161" rel="external noopener" target="_blank" draggable="false">Visit Bridge</a>
            </p>
        </div>
    </Column>
    <Column />
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

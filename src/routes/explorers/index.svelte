<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One Blockchain Explorers - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/explorers/">
    <meta property="og:title" content="Arbitrum One Blockchain Explorers - Arbucks">
    <meta name=twitter:title content="Arbitrum One Blockchain Explorers - Arbucks">
</svelte:head>

<h1>Arbitrum One Blockchain Explorers</h1>
<p class="subtitle">Blockchain explorers are used to explore information about transactions, tokens, contracts, accounts, blocks, and more.</p>

<Columns>
    <Column>
        <div class="card">
            <h2>Arbiscan</h2>
            <p>
                <a class="primary" href="https://arbiscan.io/" rel="external noopener" target="_blank" draggable="false">Visit Explorer</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Arbitrum Explorer</h2>
            <p>
                <a class="primary" href="https://explorer.arbitrum.io/" rel="external noopener" target="_blank" draggable="false">Visit Explorer</a>
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


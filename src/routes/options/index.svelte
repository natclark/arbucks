<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One Option Trading - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/options/">
    <meta property="og:title" content="Arbitrum One Option Trading - Arbucks">
    <meta name=twitter:title content="Arbitrum One Option Trading - Arbucks">
</svelte:head>

<h1>Arbitrum One Option Trading</h1>
<p class="subtitle">These are some protocols that support option trading on Arbitrum.</p>

<Columns>
    <Column>
        <div class="card">
            <h2>AntiMatter</h2>
            <p>
                <a class="primary" href="https://app.antimatter.finance/#/option_trading" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Auctus</h2>
            <p>
                <a class="primary" href="https://auctus.org/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Dopex</h2>
            <p>
                <a class="primary" href="https://www.dopex.io/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>SmartPiggies</h2>
            <p>
                <a class="primary" href="https://www.smartpiggies.com/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column />
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

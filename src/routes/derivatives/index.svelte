<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One Derivatives - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/derivatives/">
    <meta property="og:title" content="Arbitrum One Derivatives - Arbucks">
    <meta name=twitter:title content="Arbitrum One Derivatives - Arbucks">
</svelte:head>

<h1>Arbitrum One Derivatives</h1>
<p class="subtitle">These are some protocols that support derivatives and synthetics on Arbitrum.</p>

<Columns>
    <Column>
        <div class="card">
            <h2>handle.fi</h2>
            <p>
                <a class="primary" href="https://handle.fi/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Tracer</h2>
            <p>
                <a class="primary" href="https://pools.tracer.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
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

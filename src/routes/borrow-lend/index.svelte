<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One Borrowing & Lending - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/borrow-lend/">
    <meta property="og:title" content="Arbitrum One Borrowing & Lending - Arbucks">
    <meta name=twitter:title content="Arbitrum One Borrowing & Lending - Arbucks">
</svelte:head>

<h1>Arbitrum One Borrowing & Lending</h1>
<p class="subtitle">These are some protocols that support borrowing and lending on Arbitrum.</p>

<Columns>
    <Column>
        <div class="card">
            <h2>Amy Finance</h2>
            <p>
                <a class="primary" href="https://app.amy.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Channels</h2>
            <p>
                <a class="primary" href="https://channels.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>C.R.E.A.M.</h2>
            <p>
                <a class="primary" href="https://app.cream.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>dForce</h2>
            <p>
                <a class="primary" href="https://dforce.network/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Flux Protocol</h2>
            <p>
                <a class="primary" href="https://flux.01.finance/?chain=arb" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h2>Impermax</h2>
            <p>
                <a class="primary" href="https://arbitrum.impermax.finance/" rel="external noopener" target="_blank" draggable="false">Visit App</a>
            </p>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h2>WePiggy</h2>
            <p>
                <a class="primary" href="https://www.wepiggy.com/" rel="external noopener" target="_blank"
                    draggable="false">Visit App</a>
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

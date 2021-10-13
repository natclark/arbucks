<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>Arbitrum One NFTs - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/nfts/">
    <meta property="og:title" content="Arbitrum One NFTs - Arbucks">
    <meta name=twitter:title content="Arbitrum One NFTs - Arbucks">
</svelte:head>

<h1>Arbitrum One NFTs</h1>
<p class="subtitle">This is a manually updated list and may not be complete or up-to-date. If you'd like to see this page updated, please submit a pull request on GitHub. Arbucks Pro members get access to real-time Arbitrum One NFT analytics and other alpha.</p>

<h2>Marketplaces</h2>
<Columns>
    <Column>
        <div class="card">
            <h3>smolpuddle.io</h3>
        </div>
    </Column>
    <Column />
    <Column />
</Columns>

<h2>Collections</h2>
<Columns>
    <Column>
        <div class="card">
            <h3>ArbiPunk</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>Arbibots</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>YAY BEAR</h3>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h3>Deevy</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>Golden Cat NFT</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>Arbitrum Genesis NFT</h3>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h3>ARBI DEGEN APE</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>Arbi Degen Ape Academy</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>ArbiMonkes</h3>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h3>ArbiApeClub</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>Arbi Degen Ape Academy</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>ArbiMonkes</h3>
        </div>
    </Column>
</Columns>
<Columns>
    <Column>
        <div class="card">
            <h3>Metaverse Marauders</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>CastlesArbiGenOne</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>EscalationPunks</h3>
        </div>
    </Column>
</Columns>

<h2>0-Decimal ERCs</h2>
<Columns>
    <Column>
        <div class="card">
            <h3>Partyhat</h3>
        </div>
    </Column>
    <Column>
        <div class="card">
            <h3>Gabagool</h3>
        </div>
    </Column>
    <Column />
</Columns>

<style>
    h2 {
        text-align: left;
    }
    .card {
        background-color: var(--bg-soft);
        border-radius: 24px;
        padding: 20px 0;
        text-align: center;
        h3 {
            margin: 0;
        }
    }
</style>

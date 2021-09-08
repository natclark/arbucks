<script>
    import Columns from '$lib/components/Layout/Columns.svelte';
    import Column from '$lib/components/Layout/Column.svelte';
</script>

<svelte:head>
    <title>FAQ - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/faq/">
</svelte:head>

<h1>Frequently Asked Questions</h1>

<Columns>
    <Column>
        <h2>What is Arbucks?</h2>
        <p>Arbucks is an open-source charting and analytics web app for <a href="https://arbitrum.io" rel="external noopener" target="_blank">Arbitrum</a>!</p>
    </Column>
    <Column>
        <h2>Is there a token?</h2>
        <p>Not yet! Stay tuned for updates.</p>
    </Column>
</Columns>
<Columns>
    <Column>
        <h2>Can I help out?</h2>
        <p>Anyone is welcome to open an issue or submit a pull request to the <a href="https://github.com/natclark/arbucks" rel="external noopener" target="_blank">project GitHub page</a>.</p>
    </Column>
</Columns>

<style>
    h1 {
        text-align: center;
    }
</style>

<script>
    import { getContext } from 'svelte';
    import NewWalletModal from './NewWalletModal.svelte';

    const { close, open, } = getContext('simple-modal');

    const show = () => open(NewWalletModal, { close, });
</script>

<p><a class="button" draggable="false" role="button" on:click={show}>New Wallet</a></p>

<style>
    .button {
        cursor: pointer;
        margin-top: 4px;
    }
</style>

<script>
    import { goto } from '$app/navigation';
    let address;

    const handleSubmit = () => goto(`/portfolio/${address}/`);
</script>

<div class="top">
    <br>
    <h1>Arbitrum Portfolio Tracker</h1>
    <p>Track the value of a wallet's Arbitrum digital assets in real-time!</p>
</div>

<form class="input" on:submit|preventDefault={handleSubmit}>
    <input bind:value={address} class="input__field" type="text" placeholder="Search any wallet address...">
</form>

<style>
    .top {
        text-align: center;
    }
    .input {
        align-items: center;
        display: flex;
        justify-content: center;
        margin-top: 80px;
        .input__field {
            background-color: var(--bg-input);
            border: 0;
            border-radius: 24px;
            color: #fff;
            font-size: 1.275rem;
            letter-spacing: .2px;
            line-height: 1.25rem;
            text-shadow: 0 0 16px rgba(60, 100, 255, .2);
            outline: none;
            padding: 1rem;
            transition: all .08s ease-in;
            width: 80%;
            will-change: box-shadow;
            &::-ms-input-placeholder, &:-ms-input-placeholder, *::placeholder {
                color: #888;
            }
            &::placeholder {
                opacity: 1;
            }
            &:hover, &:focus, &:active {
                box-shadow: rgba(0, 0, 0, .4) 0 30px 90px;
            }
            &:focus {
                box-shadow: rgba(0, 0, 0, .16) 0 1px 4px, var(--fg-header) 0 0 0 2px;
            }
        }
    }
</style>

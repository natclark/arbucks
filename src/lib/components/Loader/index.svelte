<div class="loader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>

<style>
    @keyframes loader {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .loader {
        box-sizing: border-box;
        display: inline-block;
        height: 80px;
        position: relative;
        width: 80px;
        div {
            animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border: 4px solid var(--fg-loader);
            border-color: var(--fg-loader) transparent transparent transparent;
            border-radius: 50%;
            box-sizing: border-box;
            display: block;
            height: 60px;
            margin: 4px;
            position: absolute;
            width: 60px;
            &:nth-child(1) {
                animation-delay: -.45s;
            }
            &:nth-child(2) {
                animation-delay: -.3s;
            }
            &:nth-child(3) {
                animation-delay: -.15s;
            }
        }
    }
</style>

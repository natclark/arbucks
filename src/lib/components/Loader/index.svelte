<div class="loader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>

<style>
    @keyframes loader {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: .5;
        }
    }
    .loader {
        display: inline-block;
        height: 80px;
        position: relative;
        width: 80px;
        div {
            animation: loader 1.2s linear infinite;
            background: var(--ac-alt);
            border-radius: 50%;
            height: 16px;
            position: absolute;
            width: 16px;
            &:nth-child(1) {
                animation-delay: 0s;
                left: 8px;
                top: 8px;
            }
            &:nth-child(2) {
                animation-delay: -.4s;
                left: 32px;
                top: 8px;
            }
            &:nth-child(3) {
                animation-delay: -.8s;
                left: 56px;
                top: 8px;
            }
            &:nth-child(4) {
                animation-delay: -.4s;
                left: 8px;
                top: 32px;
            }
            &:nth-child(5) {
                animation-delay: -.8s;
                left: 32px;
                top: 32px;
            }
            &:nth-child(6) {
                animation-delay: -1.2s;
                left: 56px;
                top: 32px;
            }
            &:nth-child(7) {
                animation-delay: -.8s;
                left: 8px;
                top: 56px;
            }
            &:nth-child(8) {
                animation-delay: -1.2s;
                left: 32px;
                top: 56px;
            }
            &:nth-child(9) {
                animation-delay: -1.6s;
                left: 56px;
                top: 56px;
            }
        }
    }
</style>

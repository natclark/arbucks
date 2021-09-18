<script>
    export let text;
    export let small;

    let className = `tooltip__text`;

    const click = () => {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
            className = `tooltip__text tooltip__text--visible`;
            setTimeout(() => className = `tooltip__text`, 1000);
        }).catch((e) => console.log(`Failed to copy text.`));
    };
</script>

<div class="tooltip">
    <span class={className}>Copied!</span>
    <button on:click={click}>
        <svg class="{small == `true` ? `small` : ``}" width="12px" height="12px" x="0px" y="0px" viewBox="0 0 111.07 122.88" style="enable-background:new 0 0 111.07 122.88" xml:space="preserve">
            <title>Copy Address</title>
            <g>
                <path clip-rule="evenodd" fill-rule="evenodd" d="M97.67,20.81L97.67,20.81l0.01,0.02c3.7,0.01,7.04,1.51,9.46,3.93c2.4,2.41,3.9,5.74,3.9,9.42h0.02v0.02v75.28 v0.01h-0.02c-0.01,3.68-1.51,7.03-3.93,9.46c-2.41,2.4-5.74,3.9-9.42,3.9v0.02h-0.02H38.48h-0.01v-0.02 c-3.69-0.01-7.04-1.5-9.46-3.93c-2.4-2.41-3.9-5.74-3.91-9.42H25.1c0-25.96,0-49.34,0-75.3v-0.01h0.02 c0.01-3.69,1.52-7.04,3.94-9.46c2.41-2.4,5.73-3.9,9.42-3.91v-0.02h0.02C58.22,20.81,77.95,20.81,97.67,20.81L97.67,20.81z M0.02,75.38L0,13.39v-0.01h0.02c0.01-3.69,1.52-7.04,3.93-9.46c2.41-2.4,5.74-3.9,9.42-3.91V0h0.02h59.19 c7.69,0,8.9,9.96,0.01,10.16H13.4h-0.02v-0.02c-0.88,0-1.68,0.37-2.27,0.97c-0.59,0.58-0.96,1.4-0.96,2.27h0.02v0.01v3.17 c0,19.61,0,39.21,0,58.81C10.17,83.63,0.02,84.09,0.02,75.38L0.02,75.38z M100.91,109.49V34.2v-0.02h0.02 c0-0.87-0.37-1.68-0.97-2.27c-0.59-0.58-1.4-0.96-2.28-0.96v0.02h-0.01H38.48h-0.02v-0.02c-0.88,0-1.68,0.38-2.27,0.97 c-0.59,0.58-0.96,1.4-0.96,2.27h0.02v0.01v75.28v0.02h-0.02c0,0.88,0.38,1.68,0.97,2.27c0.59,0.59,1.4,0.96,2.27,0.96v-0.02h0.01 h59.19h0.02v0.02c0.87,0,1.68-0.38,2.27-0.97c0.59-0.58,0.96-1.4,0.96-2.27L100.91,109.49L100.91,109.49L100.91,109.49 L100.91,109.49z"></path>
            </g>
        </svg>
    </button>
</div>

<style>
    button {
        background-color: transparent;
        border: 0;
        cursor: pointer;
        padding: 0;
        transition: all .06s;
        will-change: opacity;
        &:hover {
            opacity: .8;
        }
    }
    .tooltip {
        display: inline-block;
        position: relative;
        .tooltip__text {
            background-color: #000;
            border-radius: 8px;
            bottom: calc(100% + 4px);
            color: #fff;
            left: 50%;
            margin-left: -60px;
            opacity: 0;
            padding: 6px 0;
            position: absolute;
            text-align: center;
            transition: all .2s ease-in-out;
            width: 120px;
            visibility: hidden;
            z-index: 1;
            &.tooltip__text--visible {
                opacity: 1;
                visibility: visible;
            }
        }
        button svg {
            path {
                fill: var(--fg-fill);
            }
            &.small {
                height: 8px !important;
                width: 8px !important;
            }
        }
    }
</style>

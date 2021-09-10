<script>
    import { onMount } from 'svelte';
    import theme from '$lib/stores/theme';
    import { page } from '$app/stores';
    import ripple from '$lib/services/ripple';
    import Tape from '$lib/components/Tape/index.svelte';

    let doc;
    let ls = null;

    const changeTheme = (e) => {
        ripple(e, doc);
        if (ls !== null) {
            if ($theme === `cafe`) {
                ls.setItem(`arbucks::v0:theme`, `cyberpunk`);
                theme.update(() => `cyberpunk`);
            } else {
                ls.setItem(`arbucks::v0:theme`, `cafe`);
                theme.update(() => `cafe`);
            }
        } else {
            // TODO - notify user that their browser does not support this feature
        }
    };

    theme.subscribe((val) => (typeof doc !== `undefined` && (val === `cafe` || val === `cyberpunk`)) && (doc.querySelector(`html`).setAttribute(`data-theme`, val)));

    onMount(() => {
        doc = document;
        typeof window.localStorage !== `undefined` && (ls = localStorage);
        if (ls !== null) {
            if (ls.getItem(`arbucks::v0:theme`)) {
                const currentTheme = ls.getItem(`arbucks::v0:theme`);
                if (currentTheme === `cafe` || currentTheme === `cyberpunk`) {
                    theme.update(() => currentTheme);
                } else {
                    ls.setItem(`arbucks::v0:theme`, `cafe`);
                    theme.update(() => `cafe`);
                }
            } else {
                ls.setItem(`arbucks::v0:theme`, `cafe`);
                theme.update(() => `cafe`);
            }
            doc.querySelector(`html`).setAttribute(`data-theme`, $theme);
        } else {
            doc.querySelector(`html`).setAttribute(`data-theme`, `cafe`);
        }
    });
</script>

<nav>
    <div class="container">
        <div class="left">
            <a href="/" title="Home" draggable="false" aria-current="{$page.path === `/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>
                <svg width="28px" height="28px" version="1.1" x="0px" y="0px" viewBox="0 0 122.88 112.07" style="enable-background:new 0 0 122.88 112.07" xml:space="preserve">
                    <g>
                        <path clip-rule="evenodd" fill-rule="evenodd" d="M61.44,0L0,60.18l14.99,7.87L61.04,19.7l46.85,48.36l14.99-7.87L61.44,0L61.44,0z M18.26,69.63L18.26,69.63 L61.5,26.38l43.11,43.25h0v0v42.43H73.12V82.09H49.49v29.97H18.26V69.63L18.26,69.63L18.26,69.63z"></path>
                    </g>
                </svg>
            </a>
            <details class="menu menu--mobile">
                <summary on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>
                    <svg width="26px" height="26px" viewBox="0 0 122.88 102.4">
                        <title>Menu</title>
                        <path fill-rule="evenodd" d="M35.37,0h86a1.56,1.56,0,0,1,1.55,1.55V20.21a1.58,1.58,0,0,1-1.55,1.54h-86a1.56,1.56,0,0,1-1.54-1.54V1.55A1.54,1.54,0,0,1,35.37,0Zm0,80.65h86a1.56,1.56,0,0,1,1.55,1.54v18.67a1.58,1.58,0,0,1-1.55,1.54h-86a1.56,1.56,0,0,1-1.54-1.54V82.19a1.54,1.54,0,0,1,1.54-1.54Zm-33.82,0h16a1.56,1.56,0,0,1,1.55,1.54v18.67a1.58,1.58,0,0,1-1.55,1.54h-16A1.56,1.56,0,0,1,0,100.86V82.19a1.54,1.54,0,0,1,1.55-1.54ZM35.37,62.08h86a1.56,1.56,0,0,0,1.55-1.55V41.87a1.58,1.58,0,0,0-1.55-1.55h-86a1.57,1.57,0,0,0-1.54,1.55V60.53a1.55,1.55,0,0,0,1.54,1.55Zm-33.82,0h16a1.56,1.56,0,0,0,1.55-1.55V41.87a1.58,1.58,0,0,0-1.55-1.55h-16A1.57,1.57,0,0,0,0,41.87V60.53a1.55,1.55,0,0,0,1.55,1.55ZM1.55,0h16A1.56,1.56,0,0,1,19.1,1.55V20.21a1.58,1.58,0,0,1-1.55,1.54h-16A1.56,1.56,0,0,1,0,20.21V1.55A1.54,1.54,0,0,1,1.55,0Z"></path>
                    </svg>
                </summary>
                <div class="menu__links">
                    <a href="/charts/" draggable="false" aria-current="{$page.path.includes(`/charts/`) ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Charts</a>
                    <a href="/pairs/" draggable="false" aria-current="{$page.path === `/pairs/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Pairs</a>
                    <a href="/tokens/" draggable="false" aria-current="{$page.path === `/tokens/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Tokens</a>
                    <a href="/futures/" draggable="false" aria-current="{$page.path === `/futures/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Futures</a>
                    <a href="/pools/" draggable="false" aria-current="{$page.path === `/pools/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Pools</a>
                    <a href="/farms/" draggable="false" aria-current="{$page.path === `/farms/` ? `page` : ``}" on:mousedown={(e)=>ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Farms</a>
                    <a href="/docs/" draggable="false" aria-current="{$page.path.includes(`/docs/`) ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Docs</a>
                </div>
            </details>
            <div class="menu menu--desktop">
                <a href="/charts/" draggable="false" aria-current="{$page.path.includes(`/charts/`) ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Charts</a>
                <a href="/pairs/" draggable="false" aria-current="{$page.path === `/pairs/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Pairs</a>
                <a href="/tokens/" draggable="false" aria-current="{$page.path === `/tokens/` ? `page` : ``}" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Tokens</a>
                <a href="/futures/" draggable="false" aria-current="{$page.path === `/futures/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Futures</a>
                <a href="/pools/" draggable="false" aria-current="{$page.path === `/pools/` ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Pools</a>
                <a href="/farms/" draggable="false" aria-current="{$page.path === `/farms/` ? `page` : ``}" on:mousedown={(e)=>ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Farms</a>
                <a href="/docs/" draggable="false" aria-current="{$page.path.includes(`/docs/`) ? `page` : ``}" on:mousedown={(e)=> ripple(e, doc)} on:click={(e) => ripple(e, doc)} sveltekit:prefetch>Docs</a>
            </div>
        </div>
        <div class="right">
            <button title="Change Theme">
                <svg version="1.1" width="28px" height="28px" x="0px" y="0px" viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve" on:mousedown={(e) => ripple(e, doc)} on:click={changeTheme}>
                    <g>
                        <path clip-rule="evenodd" fill-rule="evenodd" d="M122.88,61.44L122.88,61.44L122.88,61.44c0,8.47-1.5,16.34-4.5,23.58c-0.49,1.19-1.02,2.35-1.59,3.49 c-2.92,5.89-6.89,11.35-11.92,16.36l0,0l0,0l0,0l0,0l0,0c-1.67,1.68-3.4,3.24-5.17,4.68c-1.78,1.45-3.61,2.78-5.48,3.98 c-9.65,6.23-20.58,9.34-32.78,9.34h0v0c-8.47,0-16.33-1.5-23.58-4.5c-1.19-0.49-2.35-1.02-3.49-1.59 c-5.89-2.92-11.35-6.89-16.36-11.92l0,0l0,0l0,0l0,0l0,0c-1.68-1.67-3.24-3.4-4.68-5.17c-1.45-1.78-2.78-3.61-3.98-5.48 C3.11,84.58,0,73.64,0,61.44v0h0c0-8.47,1.5-16.33,4.5-23.58c0.49-1.19,1.02-2.35,1.59-3.49c2.92-5.89,6.89-11.35,11.92-16.36l0,0 l0,0l0,0l0,0l0,0c1.67-1.68,3.4-3.24,5.17-4.68c1.78-1.45,3.61-2.78,5.48-3.98C38.3,3.11,49.24,0,61.44,0h0v0 c8.47,0,16.33,1.5,23.58,4.5c1.19,0.49,2.35,1.02,3.49,1.59c5.89,2.92,11.35,6.89,16.36,11.92l0,0l0,0l0,0l0,0l0,0 c1.68,1.67,3.24,3.4,4.68,5.17c1.45,1.78,2.78,3.61,3.98,5.48C119.77,38.3,122.88,49.24,122.88,61.44L122.88,61.44z M61.44,10.96 c0.11,0,0.22,0,0.32,0v100.96c-0.11,0-0.22,0-0.32,0c-27.88,0-50.48-22.6-50.48-50.48C10.96,33.56,33.56,10.96,61.44,10.96 L61.44,10.96z"></path>
                    </g>
                </svg>
            </button>
            <a href="https://github.com/natclark/arbucks" title="GitHub" draggable="false" rel="external noopener" target="_blank" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>
                <svg width="28px" height="28px" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 640 640">
                    <path d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z"></path>
                </svg>
            </a>
            <a href="https://t.me/arbuckscafe" title="Telegram" draggable="false" rel="external noopener" target="_blank" on:mousedown={(e) => ripple(e, doc)} on:click={(e) => ripple(e, doc)}>
                <svg class="nofill" viewBox="0 0 333334 333334" width="28px" height="28px" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
                    <defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="162482" y1="307276" x2="170852" y2="26057.5"><stop offset="0" stop-color="#19a8dd"></stop><stop offset=".678" stop-color="#2ab2e2"></stop><stop offset="1" stop-color="#3cbde8"></stop></linearGradient></defs><circle cx="166667" cy="166667" r="166667" fill="url(#a)"></circle><path d="M246886 91205l-29735 149919s-4158 10396-15594 5404l-68618-52606-24952-12059-42002-14140s-6446-2288-7069-7277c-624-4992 7277-7694 7277-7694l166970-65498s13722-6030 13722 3951z" fill="#fefefe"></path><path d="M127666 239440s-2003-188-4499-8089c-2495-7901-15178-49487-15178-49487l100846-64043s5822-3535 5614 0c0 0 1040 623-2079 3534s-79222 71320-79222 71320l-5481 46765z" fill="#d4e6f1"></path><path d="M159250 214094l-27141 24745s-2122 1609-4443 601l5197-45965 26387 20619z" fill="#b6d0e5"></path>
                </svg>
            </a>
        </div>
    </div>
</nav>

<Tape />

<style>
    nav {
        align-items: center;
        background-color: var(--bg-navbar);
        box-shadow: rgba(50, 50, 93, .25) 0 6px 12px -2px, rgba(0, 0, 0, .3) 0 3px 7px -3px;
        display: grid;
        height: 70px;
        grid-template-columns: 1fr min(100ch, 100%) 1fr;
        > * {
            grid-column: 2;
        }
        .container {
            align-items: center;
            display: flex;
            justify-content: space-between;
            .left, .right {
                align-items: center;
                display: flex;
                justify-content: space-between;
                a {
                    align-items: center;
                    border-radius: 4px;
                    color: var(--fg-navbar);
                    display: flex;
                    font-size: 20px;
                    font-weight: 700;
                    height: 40px;
                    overflow: hidden;
                    padding: 0 8px;
                    position: relative;
                    text-decoration: none;
                    svg:not(.nofill) path {
                        fill: var(--fg-fill);
                    }
                    &[aria-current="page"] {
                        background-color: var(--bg-selected);
                        color: var(--fg-selected);
                    }
                    &:hover {
                        background-color: var(--bg-hover);
                    }
                }
                summary svg:not(.nofill) path {
                    fill: var(--fg-fill);
                }
                button {
                    align-items: center;
                    background-color: transparent;
                    border: 0;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    height: 40px;
                    margin: 0;
                    overflow: hidden;
                    padding: 0 8px;
                    position: relative;
                    svg:not(.nofill) path {
                        fill: var(--fg-fill);
                    }
                    &:hover {
                        background-color: var(--bg-hover);
                    }
                }
            }
            .menu {
                &.menu--mobile {
                    display: block;
                    summary {
                        align-items: center;
                        cursor: pointer;
                        display: flex;
                        font-size: 20px;
                        font-weight: 700;
                        height: 40px;
                        margin-left: 12px;
                        overflow: hidden;
                        padding: 2px 8px 0;
                        position: relative;
                        &:hover {
                            background-color: var(--bg-hover);
                        }
                    }
                    .menu__links {
                        background-color: var(--bg-menu);
                        left: 0;
                        position: absolute;
                        top: 70px;
                        width: 100%;
                        z-index: 1;
                    }
                }
                &.menu--desktop {
                    display: none;
                    a {
                        margin-left: 12px;
                    }
                }
            }
        }
    }
    @media screen and (min-width: 768px) {
        .menu {
            &.menu--mobile {
                display: none !important;
            }
            &.menu--desktop {
                display: flex !important;
            }
        }
    }
</style>

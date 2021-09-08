<nav>
    <div class="container">
        <div class="left">
            <a href="/" sveltekit:prefetch>Home</a>
        </div>
        <div class="right">
            <a href="https://github.com/natclark/arbucks" title="GitHub">
                <svg width="28px" height="28px" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 640 640">
                    <path d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z"></path>
                </svg>
            </a>
            <a href="https://t.me/arbuckscafe" title="Telegram">
                <svg viewBox="0 0 333334 333334" width="28px" height="28px" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
                    <defs><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="162482" y1="307276" x2="170852" y2="26057.5"><stop offset="0" stop-color="#19a8dd"></stop><stop offset=".678" stop-color="#2ab2e2"></stop><stop offset="1" stop-color="#3cbde8"></stop></linearGradient></defs><circle cx="166667" cy="166667" r="166667" fill="url(#a)"></circle><path d="M246886 91205l-29735 149919s-4158 10396-15594 5404l-68618-52606-24952-12059-42002-14140s-6446-2288-7069-7277c-624-4992 7277-7694 7277-7694l166970-65498s13722-6030 13722 3951z" fill="#fefefe"></path><path d="M127666 239440s-2003-188-4499-8089c-2495-7901-15178-49487-15178-49487l100846-64043s5822-3535 5614 0c0 0 1040 623-2079 3534s-79222 71320-79222 71320l-5481 46765z" fill="#d4e6f1"></path><path d="M159250 214094l-27141 24745s-2122 1609-4443 601l5197-45965 26387 20619z" fill="#b6d0e5"></path>
                </svg>
            </a>
        </div>
    </div>
</nav>

<style>
    nav {
        align-items: center;
        background-color: rgb(239, 222, 205, .6);
        box-shadow: rgba(50, 50, 93, .25) 0 6px 12px -2px, rgba(0, 0, 0, .3) 0 3px 7px -3px;
        display: grid;
        height: 70px;
        grid-template-columns: 1fr min(80ch, 100%) 1fr;
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
                    color: #222;
                    display: flex;
                    font-size: 20px;
                    font-weight: 700;
                    height: 40px;
                    padding: 0 8px;
                    text-decoration: none;
                    width: 100%;
                    &:hover {
                        background-color: rgb(238, 208, 178);
                    }
                }
            }
        }
    }
</style>

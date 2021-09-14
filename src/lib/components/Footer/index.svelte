<footer>
    <div class="columns">
        <div class="column">
            <h2>Arbitrum Tools</h2>
            <p><a href="/tokens/" draggable="false" sveltekit:prefetch>Tokens</a></p>
            <p><a href="/pools/" draggable="false" sveltekit:prefetch>Pools</a></p>
            <p><a href="/farms/" draggable="false" sveltekit:prefetch>Farms</a></p>
            <p><a href="/futures/" draggable="false" sveltekit:prefetch>Futures</a></p>
            <p><a href="/ledger/" draggable="false" sveltekit:prefetch>Ledger</a></p>
            <p><a href="/portfolio/" draggable="false" sveltekit:prefetch>Portfolio</a></p>
        </div>
        <div class="column">
            <h2>Project Info</h2>
            <p><a href="/docs/" draggable="false" sveltekit:prefetch>Docs</a></p>
            <p><a href="/docs/roadmap/" draggable="false" sveltekit:prefetch>Roadmap</a></p>
            <p><a href="/changelog/" draggable="false" sveltekit:prefetch>Changelog</a></p>
        </div>
        <div class="column">
            <h2>Socials</h2>
            <p><a href="https://github.com/natclark/arbucks" draggable="false" rel="external noopener" target="_blank">GitHub</a></p>
            <p><a href="https://twitter.com/arbucks_io" draggable="false" rel="external noopener" target="_blank">Twitter</a></p>
            <p><a href="https://t.me/arbuckscafe" draggable="false" rel="external noopener" target="_blank">Telegram</a></p>
            <p><a href="https://www.coingecko.com/en/coins/arbucks" draggable="false" rel="external noopener" target="_blank">CoinGecko</a></p>
            <p><a href="https://coinmarketcap.com/currencies/arbucks/" draggable="false" rel="external noopener" target="_blank">CoinMarketCap</a></p>
            <p><a href="mailto:contact@arbucks.io" draggable="false">contact@arbucks.io</a></p>
        </div>
    </div>
    <div class="disclaimer">
        <p>DISCLAIMER: This site contains information procured from third parties. Nothing on this site constitutes financial or legal advice. Please don't shoot the messenger!</p>
    </div>
</footer>

<style>
    footer {
        background-color: var(--bg-navbar);
        font-size: 14px;
        padding: 16px 0 0;
        text-align: center;
        .columns {
            display: block;
            width: 100%;
            .column {
                width: 100%;
                h2 {
                    font-size: 20px;
                }
                p {
                    font-size: 16px;
                    a {
                        &:hover {
                            text-decoration: underline;
                        }
                        &:visited {
                            color: var(--fg-link) !important;
                        }
                    }
                }
            }
        }
        .disclaimer {
            background-color: #000;
            color: #555;
            font-size: 12px;
            padding: 12px 4px 8px;
            p {
                margin: 0;
            }
        }
    }
    @media screen and (min-width: 768px) {
        footer {
            font-size: 18px;
            .columns {
                column-gap: 3px;
                display: flex;
                justify-content: space-between;
                .column {
                    width: 50%;
                }
            }
        }
    }
</style>

<footer>
    <div class="flex">
        <div class="columns">
            <div class="column">
                <div class="flex flex--left">
                    <img class="image" draggable="false" src="/img/arbucks-logo.svg" alt="Arbucks Logo" height="64px" width="64px" loading="lazy">
                    <h2 class="title">Arbucks</h2>
                </div>
                <p class="description">Arbucks is an open-source platform providing practical insights into Arbitrum One's on-chain metrics.</p>
            </div>
            <div class="column">
                <h2>Arbitrum Tools</h2>
                <p><a href="/tokens/" draggable="false" sveltekit:prefetch>Tokens</a></p>
                <p><a href="/pools/" draggable="false" sveltekit:prefetch>Pools</a></p>
                <p><a href="/ledger/" draggable="false" sveltekit:prefetch>Ledger</a></p>
                <p><a href="/portfolio/" draggable="false" sveltekit:prefetch>Portfolio</a></p>
            </div>
            <div class="column">
                <h2>Project Info</h2>
                <p><a href="/docs/" draggable="false" sveltekit:prefetch>Docs</a></p>
                <p><a href="/docs/team/" draggable="false" sveltekit:prefetch>Team</a></p>
                <p><a href="/docs/roadmap/" draggable="false" sveltekit:prefetch>Roadmap</a></p>
                <p><a href="/changelog/" draggable="false" sveltekit:prefetch>Changelog</a></p>
                <p><a href="/dao/" draggable="false" sveltekit:prefetch>ArbiDAO Portal</a></p>
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
        .flex {
            align-items: center;
            display: flex;
            justify-content: center;
            .flex--left {
                justify-content: flex-start;
            }
        }
        .image {
            margin-right: 16px;
        }
        .title {
            font-size: 20px !important;
        }
        .description {
            color: #fafafa;
        }
        .columns {
            display: block;
            padding: 20px 0;
            width: 100%;
            .column {
                width: 100%;
                h2 {
                    color: #fff;
                    font-size: 16px;
                }
                p {
                    font-size: 16px;
                    a {
                        color: #eee;
                        &:hover {
                            text-decoration: underline;
                        }
                        &:visited {
                            color: #eee !important;
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
            text-align: center;
            p {
                margin: 0;
            }
        }
    }
    @media screen and (min-width: 768px) {
        footer {
            font-size: 18px;
            .columns {
                column-gap: 12px;
                display: flex;
                justify-content: space-between;
                max-width: 1400px;
                .column {
                    width: 50%;
                }
            }
        }
    }
</style>

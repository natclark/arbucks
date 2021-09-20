<script>
    import { onMount } from 'svelte';

    export let id;
    export let portfolioTokens;

    let localization = {
        priceFormatter: (price) => `$${price}`,
    };

    const chartOptions = {
        grid: {
            horzLines: {
                color: `rgba(42, 46, 57, .6)`,
            },
            vertLines: {
                color: `rgba(42, 46, 57, 0)`,
            },
        },
        height: 400,
        layout: {
            backgroundColor: `#010101`,
            fontFamily: `"Inter", "Segoe UI"`,
            textColor: `#d1d4dc`,
        },
        localization,
        rightPriceScale: {
            autoScale: false,
            drawTicks: false,
            scaleMargins: {
                bottom: .25,
                top: .3,
            },
        },
        watermark: {
            color: `#777`,
            fontSize: 24,
            horzAlign: `left`,
            text: `arbucks.io`,
            vertAlign: `bottom`,
            visible: true,
        },
    };

    const seriesOptions = {
        bottomColor: `rgba(122, 43, 191, .04)`,
        topColor: `rgba(122, 43, 191, .56)`,
        lineColor: `rgba(122, 43, 191, 1)`,
        lineWidth: 2,
    };

    onMount(() => {
        let k = 0;
        let allTokens = {};

        const xhr = new XMLHttpRequest();
        xhr.onload = async () => {
            const json = JSON.parse(xhr.response); // TODO check for errors
            const array = json.data.pairHourDatas;
            console.log(json, array);
            let date = array[0].date;
            let iterations = array.length > 999 ? 1000 : array.length;
            let priceData = [];
            for (let i = 0; i < iterations; i++) {
                if (array.indexOf(array.find((e) => e.date === date)) > -1) {
                    let value = array[i].reserve1 / array[i].reserve0;
                    if (tokenTwoAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        value = parseFloat(value * ethPrice).toFixed(32).toString();
                    } else if (tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        value = parseFloat((array[i].reserve0 / array[i].reserve1) * ethPrice).toFixed(32).toString();
                    }
                    let zeroes = ``;
                    let price = ``;
                    let k = 0;
                    for (let j = 0; j < value.length; j++) {
                        if (value[0] === `0`) {
                            if (!zeroes.includes(`.`)) {
                                zeroes += value[j];
                            } else if (value[j] === `0` && k === 0) {
                                zeroes += value[j];
                            } else if (zeroes.includes(`.`) && k < 4) {
                                price += value[j];
                                k++;
                            } else if (k >= 4) {
                                break;
                            }
                        } else {
                            price += value[j];
                            if (price.includes(`.`) && k < 2) {
                                k++;
                            } else if (k >= 2) {
                                break;
                            }
                        }
                    }
                    value = parseFloat(zeroes + price);
                    priceData.push({
                        time: array[i].date,
                        value,
                    });
                } else {
                    if (i > 0) {
                        priceData.push({
                            time: date,
                            value: priceData[i - 1].value,
                        });
                    } else {
                        priceData.push({
                            time: date,
                            value: 0,
                        });
                    }
                }
                date -= 3600;
            }
            allTokens[portfolioTokens[k].pair] = priceData;
            if (k === portfolioTokens.length - 1) {
                // TODO - Do something with allTokens
                let data = [];
                let time = ~~(Date.now() / 1000);

                for (let i = -1; i < 31; i++) {
                    time -= 86400;
                    let value = 0;
                    for (let j = 0; j < portfolioTokens.length; j++) {
                        if (i === -1) {
                            value += parseFloat((portfolioTokens[j].holdings[0].close.balance / (10 ** portfolioTokens[j].decimals)) * portfolioTokens[j].price);
                        } else {
                            value += parseFloat((portfolioTokens[j].holdings[i].close.balance / (10 ** portfolioTokens[j].decimals)) * portfolioTokens[j].price);
                        }
                    }
                    data.push({
                        time,
                        value: value.toFixed(2),
                    });
                }

                data = data.sort((a, b) => {
                    return a.time - b.time;
                });

                await import('lightweight-charts/dist/lightweight-charts.standalone.production.js');
                const chart = LightweightCharts.createChart(document.querySelector(`[data-id="chart-${id}"]`), chartOptions);
                const series = chart.addAreaSeries(seriesOptions);
                series.setData(data);
                chart.timeScale().fitContent();
            }
        };
        xhr.onerror = () => {
            console.log(`Request failed.`);
        };
        for (k = 0; k < portfolioTokens.length; k++) {
            /* The Graph has issues, but it'll have to do for now. */
            if (portfolioTokens[k].pair !== ``) {
                xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
                xhr.setRequestHeader(`Content-Type`, `application/json`);
                xhr.send(JSON.stringify({
                    query: `{\n  pairHourDatas(first: 1000, where: {pair: "${portfolioTokens[k].pair}"}, orderBy: date, orderDirection: desc) {\n    id\n    date\n    pair {\n      id\n    token0Price\n    token1Price\n    }\n    reserve0\n    reserve1\n    reserveUSD\n    txCount\n\t}\n}\n`,
                    variables: null,
                }));
            }
        }
    });
</script>

<div class="chart" data-id="chart-{id}"></div>

<style global>
    .chart {
        box-shadow: rgba(0, 0, 0, .45) 0 25px 20px -20px;
        .tv-lightweight-charts {
            border-radius: 8px;
        }
    }
</style>

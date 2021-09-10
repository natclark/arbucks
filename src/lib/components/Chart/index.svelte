<script>
    import { onMount } from 'svelte';

    export let id;
    export let pairAddress;
    export let tokenOneAddress;
    export let tokenTwoAddress;
    export let tokenOnePrice;
    export let tokenTwoPrice;
    export let tokenOneSymbol;
    export let tokenTwoSymbol;
    export let ethPrice;

    let localization = {
        priceFormatter: (price) => `${price} ${tokenTwoSymbol}`,
    };

    if (tokenTwoAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
        localization = {
            priceFormatter: (price) => `$${price}`,
        };
    }

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
            backgroundColor: `#131722`,
            fontFamily: `"Inter var", "Segoe UI"`,
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
            color: `rgba(239, 222, 205, .6)`,
            fontSize: 24,
            text: `arbucks.io`,
            vertAlign: `center`,
            visible: true,
        },
    };

    const priceSeriesOptions = {
        bottomColor: `rgba(38,198,218, .04)`,
        topColor: `rgba(38,198,218, .56)`,
        lineColor: `rgba(38,198,218, 1)`,
        lineWidth: 2,
    };

    const volumeSeriesOptions = {
        color: `#26a69a`,
        priceFormat: {
            type: `volume`,
        },
        priceScaleId: ``,
        scaleMargins: {
            bottom: 0,
            top: .8,
        },
    };

    onMount(() => {
        const xhr = new XMLHttpRequest();
        xhr.onload = async () => {
            const json = JSON.parse(xhr.response); // TODO check for errors
            const array = json.data.pairHourDatas.sort((a, b) => {
                return a.date - b.date;
            }).reverse();

            let date = array[0].date;

            let iterations = array.length > 23 ? 24 : array.length;
            let priceData = [];
            let volumeData = [];

            for (let i = 0; i < iterations; i++) {
                if (array.indexOf(array.find((e) => e.date === date)) > -1) {
                    let value = array[i].reserve1 / array[i].reserve0;

                    if (tokenTwoAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        value = parseFloat(value * ethPrice).toFixed(32);
                    }

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

            priceData = priceData.sort((a, b) => {
                return a.time - b.time;
            });

            console.log(priceData);

            await import('lightweight-charts/dist/lightweight-charts.standalone.production.js');
            const chart = LightweightCharts.createChart(document.querySelector(`[data-id="chart-${id}"]`), chartOptions);
            const priceSeries = chart.addAreaSeries(priceSeriesOptions);
            priceSeries.setData(priceData);
            const volumeSeries = chart.addHistogramSeries(volumeSeriesOptions);
            volumeSeries.setData(volumeData);
            chart.timeScale().fitContent();
        };
        xhr.onerror = () => {
            console.log(`Request failed.`);
        };
        /* The Graph has issues, but it'll have to do for now. */
        xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
        xhr.setRequestHeader(`Content-Type`, `application/json`);
        xhr.send(JSON.stringify({
            query: `{\n  pairHourDatas(first: 1000, where: {pair: "${pairAddress}"}) {\n    id\n    date\n    pair {\n      id\n    token0Price\n    token1Price\n    }\n    reserve0\n    reserve1\n    reserveUSD\n    volumeToken0\n    volumeToken1\n    volumeUSD\n    txCount\n\t}\n}\n`,
            variables: null,
        }));
    });
</script>

<div class="chart" data-id="chart-{id}"></div>

<style global>
    .chart {
        .tv-lightweight-charts {
            border-radius: 8px;
        }
    }
</style>

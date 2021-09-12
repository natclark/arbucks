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
            backgroundColor: `#010101`,
            fontFamily: `"Hussar Bold", "Segoe UI"`,
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

    const priceSeriesOptions = {
        bottomColor: `rgba(122, 43, 191, .04)`,
        topColor: `rgba(122, 43, 191, .56)`,
        lineColor: `rgba(122, 43, 191, 1)`,
        lineWidth: 2,
    };

    const volumeSeriesOptions = {
        color: `#fff`,
        priceFormat: {
            type: `volume`,
        },
        priceLineVisible: true,
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

            let iterations = array.length > 999 ? 1000 : array.length;
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

            await import('lightweight-charts/dist/lightweight-charts.standalone.production.js');
            const chart = LightweightCharts.createChart(document.querySelector(`[data-id="chart-${id}"]`), chartOptions);
            const priceSeries = chart.addAreaSeries(priceSeriesOptions);
            priceSeries.setData(priceData);
            chart.timeScale().fitContent();
        };
        xhr.onerror = () => {
            console.log(`Request failed.`);
        };
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

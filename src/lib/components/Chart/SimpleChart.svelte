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
        priceFormatter: (price) => `$${price}`,
    };
    const chartOptions = {
        crosshair: {
            mode: 0,
        },
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
        timeScale: {
            secondsVisible: false,
            timeVisible: true,
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
        priceLineVisible: false,
        priceScaleId: ``,
        scaleMargins: {
            bottom: 0,
            top: .98,
        },
    };
    const renderChart = async (priceData, volumeData) => {
        await import('lightweight-charts/dist/lightweight-charts.standalone.production.js');
        const chart = LightweightCharts.createChart(document.querySelector(`[data-id="chart-${id}"]`), chartOptions);
        const priceSeries = chart.addCandlestickSeries(priceSeriesOptions);
        priceSeries.setData(priceData);
        const volumeSeries = chart.addHistogramSeries(volumeSeriesOptions);
        volumeSeries.setData(volumeData);
        chart.timeScale().fitContent();
        const resizeChart = () => window.screen.height > 768 ? chart.resize(window.getComputedStyle(document.querySelector(`.chart`)).width.slice(0, -2), 600) : chart.resize(window.getComputedStyle(document.querySelector(`.chart`)).width.slice(0, -2), 400);
        resizeChart();
        window.addEventListener(`resize`, resizeChart, true);
    };
    const calculateValue = (value) => {
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
        return parseFloat(zeroes + price);
    };
    const buildSeries = (json) => {
        const array = json.data.swaps.reverse();
        let startTime = 0;
        let endTime = 0;
        if (array.length > 0) {
            startTime = parseInt(array[0].timestamp);
            endTime = parseInt(array[array.length - 1].timestamp);
            while (startTime % 900 !== 0) startTime--;
        }
        let priceData = [];
        let volumeData = [];
        let currentBar = [];
        let previousBar = null;
        for (let i = startTime; i < endTime; i += 900) {
            let candle = {
                time: i,
                open: 0,
                high: 0,
                low: 0,
                close: 0,
            };
            let color = `rgba(2, 199, 122, .4)`;
            let volume = 0;
            const matches = array.filter((e) => (i + 900 > parseInt(e.timestamp) && i <= parseInt(e.timestamp))).sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
            if (matches.length > 0) {
                let open;
                let high;
                let low;
                let close;
                for (let j = 0; j < matches.length; j++) {
                    volume += parseFloat(matches[j].amountUSD).toFixed(2);
                    let value = matches[j].amountUSD / (matches[j].amount0In > 0 ? matches[j].amount0In : matches[j].amount1In);
                    if (tokenTwoAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        value = matches[j].amount1In > 0 ? parseFloat(matches[j].amountUSD / matches[j].amount0Out) : parseFloat(matches[j].amountUSD / matches[j].amount0In);
                    } else if (tokenOneAddress === `0x82af49447d8a07e3bd95bd0d56f35241523fbab1`) {
                        value = matches[j].amount0In > 0 ? parseFloat(matches[j].amountUSD / matches[j].amount1Out) : parseFloat(matches[j].amountUSD / matches[j].amount1In);
                    }
                    value = calculateValue(value.toString());
                    if (j === 0) {
                        open = previousBar === null ? value : previousBar.close;
                        low = value;
                        high = value;
                        close = value;
                    } else {
                        if (value > high) high = value;
                        if (value < low) low = value;
                        close = value;
                    }
                }
                open > close && (color = `rgba(255, 59, 105, .4)`);
                candle.open = open;
                candle.high = high;
                candle.low = low;
                candle.close = close;
                previousBar = candle;
            } else {
                candle.open = previousBar.close;
                candle.high = previousBar.close;
                candle.low = previousBar.close;
                candle.close = previousBar.close;
            }
            priceData.push(candle);
            volumeData.push({
                color,
                time: i,
                value: parseFloat(volume).toFixed(2),
            });
        }
        priceData = priceData.sort((a, b) => a.time - b.time);
        return {
            lastTimestamp: priceData.length > 0 ? priceData[0].time : null,
            priceData,
            volumeData,
        };
    };
    onMount(() => {
        let i = 0;
        let priceData = [];
        let volumeData = [];
        let previousLastTimestamp = -1;
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const json = JSON.parse(xhr.response); // TODO check for errors
            const result = buildSeries(json);
            if (i === 0) {
                priceData = result.priceData;
                volumeData = result.volumeData;
                if (result.lastTimestamp !== null && result.priceData.length > 0) {
                    previousLastTimestamp = result.lastTimestamp;
                    xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
                    xhr.setRequestHeader(`Content-Type`, `application/json`);
                    xhr.send(JSON.stringify({
                        query: `{\n  swaps(first: 1000, where: {pair: "${pairAddress}", timestamp_lte: "${result.lastTimestamp}"}, orderBy: timestamp, orderDirection: desc) {\n    id\n    pair {\n      id\n    token0Price\n    token1Price\n    }\n    amount0In\n    amount1In\n    amount0Out\n    amount1Out\n    amountUSD\n    timestamp\n\t}\n}\n`,
                        variables: null,
                    }));
                } else {
                    renderChart([], []);
                }
            } else {
                priceData = result.priceData.concat(priceData);
                volumeData = result.volumeData.concat(volumeData);
                if (result.lastTimestamp !== null && result.priceData.length > 0 && result.lastTimestamp !== previousLastTimestamp) {
                    previousLastTimestamp = result.lastTimestamp;
                    xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
                    xhr.setRequestHeader(`Content-Type`, `application/json`);
                    xhr.send(JSON.stringify({
                        query: `{\n  swaps(first: 1000, where: {pair: "${pairAddress}", timestamp_lte: "${result.lastTimestamp}"}, orderBy: timestamp, orderDirection: desc) {\n    id\n    pair {\n      id\n    token0Price\n    token1Price\n    }\n    amount0In\n    amount1In\n    amount0Out\n    amount1Out\n    amountUSD\n    timestamp\n\t}\n}\n`,
                        variables: null,
                    }));
                } else {
                    renderChart(priceData, volumeData);
                }
            }
            i++;
        };
        xhr.onerror = () => {
            console.log(`Request failed.`);
        };
        /* The Graph has issues, but it'll have to do for now. */
        xhr.open(`POST`, `https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange`);
        xhr.setRequestHeader(`Content-Type`, `application/json`);
        xhr.send(JSON.stringify({
            query: `{\n  swaps(first: 1000, where: {pair: "${pairAddress}"}, orderBy: timestamp, orderDirection: desc) {\n    id\n    pair {\n      id\n    token0Price\n    token1Price\n    }\n    amount0In\n    amount1In\n    amount0Out\n    amount1Out\n    amountUSD\n    timestamp\n\t}\n}\n`,
            variables: null,
        }));
    });
</script>

<div class="chart" data-id="chart-{id}"></div>

<style global>
    .chart {
        box-shadow: rgba(0, 0, 0, .45) 0 25px 20px -20px;
        width: 100%;
    }
</style>

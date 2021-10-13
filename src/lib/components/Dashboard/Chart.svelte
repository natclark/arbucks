<script>
    import { onMount } from 'svelte';
    export let id;

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
            fontFamily: `"Metropolis Regular", "Segoe UI"`,
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
    const renderChart = async (priceData) => {
        await import('lightweight-charts/dist/lightweight-charts.standalone.production.js');
        document.querySelector(`[data-id="chart-${id}"]`).innerHTML = ``;
        const chart = LightweightCharts.createChart(document.querySelector(`[data-id="chart-${id}"]`), chartOptions);
        const priceSeries = chart.addCandlestickSeries(priceSeriesOptions);
        priceSeries.setData(priceData);
        chart.timeScale().fitContent();
        const resizeChart = () => window.screen.height > 768 ? chart.resize(window.getComputedStyle(document.querySelector(`.chart`)).width.slice(0, -2), 600) : chart.resize(window.getComputedStyle(document.querySelector(`.chart`)).width.slice(0, -2), 400);
        resizeChart();
        window.addEventListener(`resize`, resizeChart, true);
        switching = false;
    };
    let priceData = [];
    onMount(async () => {
        try {
            const data = await fetch(`https://l2beat.com/api/arbitrum.json`);
            const items = JSON.parse(data);
            items.forEach((item) => {
                priceData.push({
                    time: item[0],
                    value: item[1],
                });
            });
            renderChart(priceData);
        } catch (e) {
            // TODO
        }
    });
</script>

<div class="chart" data-id="chart-{id}" />

<style global>
    .chart {
        box-shadow: rgba(0, 0, 0, .45) 0 25px 20px -20px;
        width: 100%;
    }
</style>

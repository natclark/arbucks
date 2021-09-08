<script>
    import { onMount } from 'svelte';

    export let id;
    export let address;

    let supplyMax = `0`;
    let supplyCirculating = `0`;

    const chartOptions = {
        height: 400,
        layout: {
            backgroundColor: `#000`,
            textColor: `#fff`,
            fontFamily: `'Segoe UI'`,
        },
        localization: {
            priceFormatter: (price) => `$${price}`,
        },
        rightPriceScale: {
            borderVisible: false,
            drawTicks: false,
            scaleMargins: {
                bottom: .1,
                top: .1,
            },
        },
        timeScale: {
            borderVisible: false,
        },
        watermark: {
            color: `#000`,
        },
        grid: {
            horzLines: {
                visible: false,
            },
            vertLines: {
                visible: false,
            },
        },
        crosshair: {
            horzLine: {
                visible: true,
                style: 3,
                width: 1,
                color: `#555`,
                labelBackgroundColor: `rgba(239, 222, 205, .6)`,
            },
            vertLine: {
                visible: true,
                style: 3,
                width: 1,
                color: `#555`,
                labelBackgroundColor: `rgba(239, 222, 205, 06)`,
            },
        },
    };

    const seriesOptions = {
        lineColor: `rgba(239, 222, 205, .6)`,
        topColor: `rgba(239, 222, 205, .4)`,
        bottomColor: `rgba(239, 222, 205, 0)`,
        lineWidth: 2,
        priceLineVisible: false
    };

    onMount(async () => {
        await import('lightweight-charts/dist/lightweight-charts.standalone.production.js');
        const chart = LightweightCharts.createChart(document.querySelector(`[data-id="chart-${id}"]`), chartOptions);
        chart.timeScale().fitContent();
        const lineSeries = chart.addAreaSeries(seriesOptions);
        lineSeries.setData();
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

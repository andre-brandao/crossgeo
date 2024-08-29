<script lang="ts">
  import {
    type Dataset,
    type ComplexQuery,
    type Operator,
    type Query,
    type SimpleQuery,
    applyFilters,
  } from '$components/map/dataset'

  import { cubicInOut } from 'svelte/easing'

  import { icons } from '$lib/utils'
  import SvChart from './SVChart.svelte'
  import type { Chart, ChartTypeRegistry } from 'chart.js'
  import { derived } from 'svelte/store'

  import {interpolateInferno} from 'd3-scale-chromatic'

  interface QueryChartProps {
    id?: any
    handleDelete?: () => void | Promise<void>
    handleEdit?: () => void | Promise<void>
    title?: string
    type?: 'line' | 'bar' | 'area' | string
    dataset: Dataset
    filters: {
      label: string
      query: Query
    }[]
  }

  let {
    id,
    handleDelete,
    handleEdit,
    title,
    type,
    dataset,
    filters,
  }: QueryChartProps = $props()

  let chartConfig = {
    type: type,
    data: {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          // backgroundColor: [],
          backgroundColor: [
            'red',
            '#dab193',
            '#dab193',
            '#dab193',
            '#dab193',
            '#dab193',
            '#ffffff',
          ],
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'top',
        },
        //   title: {
        //     display: true,
        //     text: '',
        //   },
      },
    },
  }

  let chart: Chart | null = $state(null)

  $effect(() => {
    console.log('should update chart', chart)

    if (!chart) return
    chart.data.labels = filters.map(({ label }) => label)
    chart.data.datasets[0].data = filters.map(
      ({ query, label }) => applyFilters(dataset, query).length,
    )

    chart.data.datasets[0].type = type ?? 'bar'

    const dataLength = chart.data.datasets[0].data.length
    /* Create color array */
    const COLORS = interpolateColors(dataLength, colorScale, colorRangeInfo)

    chart.data.datasets[0].backgroundColor = COLORS

    chart?.update()
  })
  const colorScale = interpolateInferno;
  const colorRangeInfo = {
   colorStart: 0.2,
   colorEnd: 1,
   useEndAsStart: false,
}

  function interpolateColors(dataLength, colorScale, colorRangeInfo) {
    var { colorStart, colorEnd } = colorRangeInfo
    var colorRange = colorEnd - colorStart
    var intervalSize = colorRange / dataLength
    var i, colorPoint
    var colorArray = []

    for (i = 0; i < dataLength; i++) {
      colorPoint = calculatePoint(i, intervalSize, colorRangeInfo)
      colorArray.push(colorScale(colorPoint))
    }

    return colorArray
  }

  function calculatePoint(i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
    return useEndAsStart
      ? colorEnd - i * intervalSize
      : colorStart + i * intervalSize
  }
</script>

<div>
  <div class="flex items-center justify-between p-4">
    <h1 class="text-lg font-bold">{title}</h1>

    {#if id}
      <div>
        {#if handleDelete}
          <button class="btn btn-circle btn-error" onclick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        {/if}
        {#if handleEdit}
          <button class="btn btn-circle btn-info" onclick={handleEdit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-pencil"
            >
              <path
                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
              />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  </div>
  <div class=" h-[320px] min-w-[400px] rounded p-4">
    <SvChart height={320} width={400} bind:chart config={chartConfig} />
  </div>
</div>

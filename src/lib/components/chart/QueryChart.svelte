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

  import {
    Area,
    Axis,
    Chart,
    ChartClipPath,
    Highlight,
    Labels,
    LinearGradient,
    Point,
    RectClipPath,
    Spline,
    Svg,
    Text,
    Tooltip,
    TooltipItem,
    Bars,
    Group,
    Points,
  } from 'layerchart'
  import { scaleBand } from 'd3-scale'
  import {
    curveLinearClosed,
    curveCatmullRomClosed,
    curveCatmullRom,
  } from 'd3-shape'
  import { icons } from '$lib/utils'

  interface QueryChartProps {
    id?: any
    handleDelete?: () => void | Promise<void>
    handleEdit?: () => void | Promise<void>
    title?: string
    type?: 'bar' | 'line' | 'area' | 'radar' | string
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

  // export let id: any | undefined
  // export let handleDelete: () => void | Promise<void> | undefined
  // export let handleEdit: () => void | Promise<void> | undefined
  // export let title = 'Chart Title'
  // export let type = 'bar'

  // export let dataset: Dataset

  // export let filters: {
  //   label: string
  //   query: Query
  // }[]

  let data: {
    x: string
    y: number
  }[] = $state([])
  $effect(() => {
    data =
      filters.map(({ query, label }) => ({
        x: label,
        y: applyFilters(dataset, query).length,
      })) ?? []
  })

  // $: data =
  //   filters.map(({ query, label }) => ({
  //     x: label,
  //     y: applyFilters(dataset, query).length,
  //   })) ?? []
  // $: console.log(data, filters)
</script>

<div>
  <div class="flex items-center justify-between p-4">
    <h1 class="text-lg font-bold">{title}</h1>

    {#if id}
      <div>
        {#if handleDelete}
          <button class="btn btn-circle btn-error" onclick={handleDelete}>
            x
          </button>
        {/if}
        {#if handleEdit}
          <button class="btn btn-circle btn-primary" onclick={handleEdit}>
            ✏️
          </button>
        {/if}
      </div>
    {/if}
  </div>
  <div class=" h-[320px] rounded p-4">
    {#if type === 'bar'}
      <Chart
        {data}
        x="x"
        xScale={scaleBand().padding(0.3)}
        y="y"
        yDomain={[0, null]}
        yNice={4}
        padding={{ left: 16, bottom: 24 }}
        tooltip={{ mode: 'band' }}
      >
        <Svg>
          <Axis placement="left" grid rule />
          <Axis placement="bottom" format={d => d} rule />
          <Bars
            radius={4}
            strokeWidth={1}
            class="fill-primary transition-colors group-hover:fill-gray-300"
            tweened={{
              easing: cubicInOut,
              delay: 0,
              duration: 300,
            }}
          />
          <Highlight area>
            <svelte:fragment slot="area" let:area>
              <RectClipPath
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                spring
              >
                <Bars radius={4} strokeWidth={1} class="fill-primary" />
              </RectClipPath>
            </svelte:fragment>
          </Highlight>
        </Svg>
        <Tooltip header={data => `${data.x}`} let:data>
          <TooltipItem label="value" value={data.y} />
        </Tooltip>
      </Chart>
    {:else if type === 'area'}
      <Chart
        {data}
        x="x"
        xScale={scaleBand().padding(0.3)}
        y="y"
        yDomain={[0, null]}
        yNice
        padding={{ left: 16, bottom: 24 }}
        tooltip={{ mode: 'bisect-x' }}
      >
        <Svg>
          <LinearGradient
            id="tw-1"
            class="from-primary to-base-100"
            vertical
            let:url
          >
            <Axis placement="left" grid rule />
            <Axis placement="bottom" grid rule />
            <!-- format={d => new Date(d).getDay()} -->
            <Area
              line={{ class: 'stroke-2 stroke-primary' }}
              fill={url}
              tweened={{
                easing: cubicInOut,
                delay: 0,
                duration: 300,
              }}
            />
            <Highlight points lines />
          </LinearGradient>
        </Svg>
        <Tooltip header={data => `${data.x}`} let:data>
          <TooltipItem label="value" value={data.y} />
        </Tooltip>
      </Chart>
    {:else if type === 'line'}
      <Chart
        {data}
        x="x"
        xScale={scaleBand()}
        y="y"
        yDomain={[0, null]}
        yNice
        padding={{ left: 16, bottom: 24 }}
        tooltip={{ mode: 'band' }}
      >
        <Svg>
          <Axis placement="left" grid rule />
          <Axis placement="bottom" format={d => d.x} rule />
          <Spline
            class="stroke-primary stroke-2"
            tweened={{
              easing: cubicInOut,
              delay: 0,
              duration: 300,
            }}
          />
          <Highlight points lines />
        </Svg>
        <Tooltip header={data => `${data.x}`} let:data>
          <TooltipItem label="value" value={data.y} />
        </Tooltip>
      </Chart>
    {:else if type === 'radar'}
      <Chart
        {data}
        x="x"
        xScale={scaleBand()}
        xDomain={data.map(d => d.x)}
        xRange={[0, 2 * Math.PI]}
        y="y"
        yRange={({ height }) => [0, height / 2]}
        yPadding={[0, 10]}
        padding={{ top: 32, bottom: 8 }}
      >
        <Svg>
          <Group center>
            <Axis
              placement="radius"
              grid={{ class: 'stroke-surface-content/20 fill-surface-200/50' }}
              ticks={[0, 50, 100]}
              format={d => ''}
            />
            <Axis
              placement="angle"
              grid={{ class: 'stroke-surface-content/20' }}
            />
            <Spline
              radial
              curve={curveLinearClosed}
              class="fill-primary/20 stroke-primary"
            />
            <Points radial class="fill-primary stroke-surface-200" />
          </Group>
        </Svg>
      </Chart>
    {/if}
  </div>
</div>

<script lang="ts">
  import {
    Chart,
    ChartClipPath,
    Circle,
    Points,
    Svg,
    Tooltip,
    TooltipItem,
    Voronoi,
  } from 'layerchart'

  export let latLongs: {
    x: number
    y: number
    metadata?: Record<string, any>
  }[] = []

  console.log(latLongs)

  let point = { x: 0, y: 0 }
  function onPointerMove(e: PointerEvent) {
    point = {
      x: e.offsetX,
      y: e.offsetY,
    }
  }
</script>

<div
  class="relative h-full rounded border p-4"
  on:pointermove={onPointerMove}
>
  <Chart
    data={latLongs}
    x="x"
    y="y"
    let:xScale
    let:yScale
    tooltip={{ mode: 'voronoi' }}
  >
    <Svg>
      <ChartClipPath>
        <Points r={2} class="fill-primary stroke-primary" />
        <Voronoi
          data={[
            { x: xScale.invert(point.x), y: yScale.invert(point.y) },
            ...latLongs,
          ]}
          classes={{
            path: 'pointer-events-none stroke-primary fill-primary/10 first:fill-primary/50',
          }}
        />
        <Circle cx={point.x} cy={point.y} r={4} class="fill-primary" />
      </ChartClipPath>
    </Svg>

    <Tooltip header={data => 'Ponto de Voronoi'} let:data>
      <table class="w-full border-collapse">
        <tbody>
          {#each Object.entries(data.metadata) as [key, value]}
            <tr>
              <th class="border border-black p-2">{key}</th>
              <td class="border border-black p-2">{value}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </Tooltip>
  </Chart>
</div>

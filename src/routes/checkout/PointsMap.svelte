<script lang="ts">
  import { geoAlbersUsa, geoNaturalEarth1 } from 'd3-geo'
  import { feature } from 'topojson-client'

  import {
    Canvas,
    Chart,
    GeoPath,
    GeoPoint,
    Svg,
    Text,
    Tooltip,
    TooltipItem,
  } from 'layerchart'

  export let data

  export let showPoints = 200
  const countries = feature(
    data.world.geojson,
    data.world.geojson.objects.countries,
  )

  $: airports = data.world.airports.slice(0, showPoints)
</script>

<div class="h-[600px]">
  <Chart
    data={data.world.airports}
    x="longitude"
    y="latitude"
    geo={{
      projection: geoNaturalEarth1,
      fitGeojson: countries,
    }}
  >
    <Svg>
      <g class="countries">
        {#each countries.features as feature}
          <GeoPath
            geojson={feature}
            class="fill-surface-content/10 stroke-surface-100"
          />
        {/each}
      </g>
      <g class="points pointer-events-none">
        {#each airports as airport}
          <GeoPoint
            lat={airport.latitude}
            long={airport.longitude}
            r={1}
            class="fill-primary"
          />
        {/each}

      
      </g>
    </Svg>

  </Chart>
</div>

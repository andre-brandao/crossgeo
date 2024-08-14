import { autoType, csvParse } from 'd3-dsv'
// import pageSource from './+page.svelte?raw'
import type { GeometryCollection, Topology } from 'topojson-specification'
// import type { USAirportsData } from '$static/geo_data/us-airports'
// import type { USStateCapitalsData } from '$static/data/examples/geo/us-state-capitals.js'
// import type { WorldAirportsData } from '$static/data/examples/geo/world-airports.js'
// import type { WorldCapitalsData } from '$static/data/examples/geo/world-capitals.js'
type WorldAirportsData = {
  name: string
  latitude: number
  longitude: number
}[]
export async function load({fetch}) {
  return {
    world: {
      geojson: (await fetch(
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
      ).then(r => r.json())) as Topology<{
        countries: GeometryCollection<{ name: string }>
        land: GeometryCollection
      }>,
      airports: (await fetch('/geo_data/world-airports.csv').then(
        async r => csvParse(await r.text(), autoType),
      )) as WorldAirportsData,
    },
  }
}

<script lang="ts">
  import type { PageData } from './$types'
  import L from 'leaflet'

  export let data: PageData

  const { map } = data

  import Map from '$components/map/Map.svelte'
  import ParsedTable from '$components/table/ParsedTable.svelte'

  let locations = map.points.map(p => ({
    latLong: new L.LatLng(p.lat, p.long),
    metadata: p.meta_data,
  }))
</script>

<div>
  <div class="h-[50vh]">
    <Map
      {locations}
      initailZoom={12}
      initialLocation={[map.lat ?? 1, map.long ?? 1]}
      toogle_table={() => console.log('toogle_table')}
      lasso_selected={e => console.log('lasso_selected', e)}
    />
  </div>

  <div>
    <ParsedTable
      data={{
        headers: map.fields_info.fields,
        rows: locations.map(l => l.metadata ?? {}),
      }}
    />
  </div>
</div>

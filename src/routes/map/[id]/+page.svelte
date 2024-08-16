<script lang="ts">
  import Map from '$components/map/Map.svelte'
  import ParsedTable from '$components/table/ParsedTable.svelte'
  import QueryChart from '$lib/components/chart/QueryChart.svelte'
  import Vonoroi from '$components/chart/Voronoi.svelte'
  import type { Dataset } from '$lib/components/map/dataset'
  import EditChart from './EditChart.svelte'
  import L from 'leaflet'
  import { modal } from '$modal'

  import { page } from '$app/stores'

  import Share from '$components/share/index.svelte'
  import type { PageData } from './$types'
  export let data: PageData

  const { map } = data

  let isTableActive = true
  let isVonoroiActive = false

  let locations = map.points.map(p => ({
    latLong: new L.LatLng(p.lat, p.long),
    metadata: p.meta_data,
  }))

  let filtered_data = locations.map(l => l.metadata).filter(l => l !== null)

  let charts = [
    {
      title: 'Barra Confirmados',
      filters: [
        {
          label: 'Confirmadao',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Confirmado',
          },
        },
        {
          label: 'Descartado',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Descartado',
          },
        },
        {
          label: 'Teste',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Descartado',
          },
        },
      ],
      type: 'bar',
    },
    {
      title: 'Linha Casos Confirmados',
      filters: [
        {
          label: 'Confirmadao',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Confirmado',
          },
        },
        {
          label: 'Descartado',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Descartado',
          },
        },
        {
          label: 'Teste',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Descartado',
          },
        },
      ],
      type: 'line',
    },
    {
      title: 'Linha Casos Confirmados',
      filters: [
        {
          label: 'Confirmadao',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Confirmado',
          },
        },
        {
          label: 'Descartado',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Descartado',
          },
        },
        {
          label: 'Teste',
          query: {
            field: 'CLASSIFICACAO_FINAL',
            operator: 'eq',
            value: 'Descartado',
          },
        },
      ],
      type: 'line',
    },
  ]

  function handleLassoSelected(e: Dataset) {
    console.log('lasso_selected', e)
    if (e.length === 0) {
      return (filtered_data = locations
        .map(l => l.metadata)
        .filter(l => l !== null))
    }
    filtered_data = e
  }

  function modalCreateNewChart() {
    modal.open(EditChart, {
      chart: {
        title: 'New Chart',
        filters: [],
        type: 'bar',
      },
      dataset: {
        headers: map.fields_info.fields,
        rows: filtered_data,
      },
    })
  }
</script>

<div
  class="flex h-full items-center justify-center gap-4 p-4 max-lg:flex-col max-lg:overflow-auto"
>
  <div class="flex w-full flex-col justify-between lg:w-2/3">
    <div class="h-[40vh] overflow-hidden rounded-t-lg shadow-lg">
      {#if isVonoroiActive}
        <Vonoroi
          latLongs={locations.map(l => ({
            x: l.latLong.lng,
            y: l.latLong.lat,
            metadata: l.metadata ?? undefined,
          }))}
        />
      {:else}
        <Map
          {locations}
          initailZoom={12}
          initialLocation={[map.lat ?? 1, map.long ?? 1]}
          toogle_table={b => (isTableActive = !isTableActive)}
          lasso_selected={handleLassoSelected}
        />
      {/if}
    </div>

    <div class:hidden={!isTableActive}>
      <ParsedTable
        data={{
          headers: map.fields_info.fields,
          rows: filtered_data,
        }}
      />
    </div>
  </div>

  <div class="flex w-full flex-col gap-4 lg:w-1/3">
    <button on:click={modalCreateNewChart} class="btn btn-primary w-full">
      Create New Chart
    </button>
    <button
      on:click={() => (isVonoroiActive = !isVonoroiActive)}
      class="btn btn-primary w-full"
    >
      {isVonoroiActive ? 'Show Map' : 'Show Voronoi'}
    </button>

    <Share title="CrossMap {map.name}" url={$page.url} />

    <div
      class="flex max-h-[68vh] flex-col gap-4 overflow-y-scroll rounded-lg border bg-base-100 p-2 shadow-lg"
    >
      {#each charts as chart}
        <QueryChart dataset={filtered_data} {...chart} />
      {/each}
    </div>
  </div>
</div>

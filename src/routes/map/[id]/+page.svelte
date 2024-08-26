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
  import CsvDownload from './CSVDownload.svelte'
  import { toast } from 'svelte-sonner'
  import { trpc } from '$trpc/client'
  export let data: PageData

  const { map } = data

  let isTableActive = true
  let isVonoroiActive = false

  let locations = map.data[0].points.map(p => ({
    latLong: new L.LatLng(p.lat, p.long),
    metadata: p.meta_data,
  }))

  let filtered_data = locations.map(l => l.metadata).filter(l => l !== null)

  let charts = map.data[0].charts

  function handleLassoSelected(e: Dataset) {
    console.log('lasso_selected', e)
    if (e.length === 0) {
      return (filtered_data = locations
        .map(l => l.metadata)
        .filter(l => l !== null))
    }
    filtered_data = e
  }

  async function handleDelete(id: number) {
    console.log('delete', id)
    console.log('alert', id)
    // alet
    if (!confirm('Are you sure you want to delete this chart?')) {
      return
    }
    try {
      await trpc($page).map.deleteChart.mutate({
        id,
      })

      toast.success('Chart deleted')
      charts = charts.filter(c => c.id !== id)
    } catch (error: any) {
      toast.error(error.message)
      return
    }
    // modal.alert({
    //   text: 'Are you sure you want to delete this chart?',
    //   onConfirm: async () => {
    //     console.log('alert', id)
    //     try {
    //       await trpc($page)
    //         .map.deleteChart.mutate({
    //           id,
    //         })

    //         toast.success('Chart deleted')
    //         charts = charts.filter(c => c.id !== id)
    //     } catch (error: any) {
    //       toast.error(error.message)
    //       return
    //     }
    //   },
    // })
  }

  function modalCreateNewChart() {
    modal.open(EditChart, {
      chart: {
        title: 'New Chart',
        filters: [],
        type: 'bar',
      },
      dataset: {
        headers: map.data[0].fields_info.fields,
        rows: filtered_data,
      },
      save: async chart => {
        if (chart.filters.length === 0) {
          toast.error('Please select at least one filter')
          return
        }
        if (!chart.title) {
          toast.error('Please insert a title')
          return
        }

        try {
          const [resp] = await trpc($page).map.createChart.mutate({
            data_id: map.data[0].id,
            // @ts-ignore
            filters: chart.filters,
            title: chart.title,
            type: chart.type,
          })

          if (resp) {
            // @ts-ignore
            charts = [resp, ...charts]
            modal.close()
          }
        } catch (error: any) {
          toast.error(error.message)
        }
      },
    })
  }
</script>

<div
  class="flex flex-col-reverse items-center justify-center gap-4 p-3 lg:flex-row"
>
  <div class="flex w-full flex-col justify-between lg:w-2/3">
    <div class="top-0 h-[38vh] overflow-hidden rounded-t-lg shadow-lg">
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
          headers: map.data[0].fields_info.fields,
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

    <CsvDownload className="btn btn-secondary w-full" data={filtered_data} />

    <div class="flex flex-wrap items-center justify-center gap-1">
      <h1 class="font-bold">Compartilhar:</h1>
      <Share
        title="Conheça o mapa que criei utilizando o CrossGeo:  {map.name}"
        url={$page.url}
      />
    </div>

    <div
      class="flex max-h-[65vh] flex-col gap-4 overflow-y-scroll rounded-lg border bg-base-100 p-2 shadow-lg"
    >
      {#each charts as chart}
        <QueryChart
          dataset={filtered_data}
          {...chart}
          handleDelete={() => {
            handleDelete(chart.id)
          }}
        />
      {/each}
    </div>
  </div>
</div>

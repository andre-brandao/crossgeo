<script lang="ts">
  import Map from '$components/map/Map.svelte'
  import ParsedTable from '$components/table/ParsedTable.svelte'
  import QueryChart from '$lib/components/chart/QueryChart.svelte'
  import SvChartQuery from '$lib/components/SVChartQuery.svelte'

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
  import * as m from '$msgs'
  import { PaneGroup, Pane, PaneResizer } from 'paneforge'
  export let data: PageData

  const { map } = data

  let isTableActive = true
  let isVonoroiActive = false
  let isMapActive = true
  let isChartActive = true

  let locations = map.map_data[0].data.points.map(p => ({
    latLong: new L.LatLng(p.lat, p.long),
    metadata: p.meta_data,
  }))

  let filtered_data = locations.map(l => l.metadata).filter(l => l !== null)

  let charts = map.map_data[0].data.charts

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
  }

  function handleEditChart(c: (typeof charts)[0]) {
    modal.open(EditChart, {
      chart: c,
      dataset: {
        headers: map.map_data[0].data.fields_info.fields,
        rows: filtered_data,
      },
      save: async chart => {
        console.log('save', chart)

        if (chart.filters.length === 0) {
          toast.error('Please select at least one filter')
          return
        }
        if (!chart.title) {
          toast.error('Please insert a title')
          return
        }
        if (!chart.id) {
          toast.error('Chart id not found')
          return
        }

        try {
          const [resp] = await trpc($page).map.updateChart.mutate({
            id: chart.id,
            chart: {
              title: chart.title,
              type: chart.type,
              // @ts-ignore
              filters: chart.filters,
            },
          })

          if (resp) {
            toast.success('Chart updated')
            // @ts-expect-error fail to infer type
            charts = charts.map(c => (c.id === chart.id ? resp : c))
            modal.close()
            // window.location.reload()
          }
        } catch (error: any) {
          console.log('error', error)
          toast.error(error.message)
        }
      },
    })
  }

  function modalCreateNewChart() {
    modal.open(EditChart, {
      chart: {
        title: 'New Chart',
        filters: [],
        type: 'bar',
      },
      dataset: {
        headers: map.map_data[0].data.fields_info.fields,
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
            data_id: map.map_data[0].data.id,
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

  function canToggle(view) {
    const activeViews = [isTableActive, isMapActive, isChartActive].filter(
      Boolean,
    ).length
    return activeViews > 1 || !view
  }
</script>

<div class="h-[83vh]">
  <div class="mx-2 my-2 flex justify-between">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        class="btn {isMapActive ? 'btn-primary' : 'btn-secondary'}"
        on:click={() => {
          if (canToggle(isMapActive)) {
            isMapActive = !isMapActive
          }
        }}
      >
        {isMapActive ? m.hide_map() : m.show_map()}
      </button>
      <button
        class="btn {isTableActive ? 'btn-primary' : 'btn-secondary'}"
        on:click={() => {
          if (canToggle(isTableActive)) {
            isTableActive = !isTableActive
          }
        }}
      >
        {isTableActive ? m.hide_table() : m.show_table()}
      </button>
      <button
        class="btn {isChartActive ? 'btn-primary' : 'btn-secondary'}"
        on:click={() => {
          if (canToggle(isChartActive)) {
            isChartActive = !isChartActive
          }
        }}
      >
        {isChartActive ? m.hide_chart() : m.show_chart()}
      </button>

      <!-- <h1 class="font-bold">{m.share()}:</h1> -->
      <Share
        title="Conheça o mapa que criei utilizando o CrossGeo:  {map.name}"
        url={$page.url}
      />
    </div>

    <div class="flex gap-2">
      <button on:click={modalCreateNewChart} class="btn btn-primary">
        {m.create_new()}
      </button>

      <!-- <button
        on:click={() => (isVonoroiActive = !isVonoroiActive)}
        class="btn btn-primary w-full"
      >
        {isVonoroiActive ? m.show_map() : m.show_voronoi()}
      </button>
  
      -->
      <CsvDownload
        className="btn btn-secondary"
        data={locations
          .map(l => ({
            ...l.metadata,
            lat: l.latLong.lat,
            long: l.latLong.lng,
          }))
          .filter(l => l !== null)}
      />
    </div>
  </div>
  <div class="h-full">
    <PaneGroup direction="horizontal">
      {#if isMapActive || isTableActive}
        <Pane
          defaultSize={isChartActive && !isMapActive && !isTableActive ? 0 : 70}
        >
          <PaneGroup direction="vertical">
            {#if isMapActive}
              <Pane defaultSize={60} order={1}>
                <!-- <Vonoroi
                latLongs={locations.map(l => ({
                  x: l.latLong.lng,
                  y: l.latLong.lat,
                  metadata: l.metadata ?? undefined,
                }))}
              /> -->
                <Map
                  {locations}
                  initailZoom={12}
                  initialLocation={[map.lat ?? 1, map.long ?? 1]}
                  lasso_selected={handleLassoSelected}
                />
              </Pane>
            {/if}

            {#if isMapActive && isTableActive}
              <PaneResizer
                class="flex h-2 w-full items-center justify-center bg-base-300"
              >
                <div
                  class="z-10 flex h-5 w-10 items-center justify-center rounded-sm bg-primary"
                >
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
                    class="lucide lucide-grip-horizontal text-primary-content"
                  >
                    <circle cx="12" cy="9" r="1" />
                    <circle cx="19" cy="9" r="1" />
                    <circle cx="5" cy="9" r="1" />
                    <circle cx="12" cy="15" r="1" />
                    <circle cx="19" cy="15" r="1" />
                    <circle cx="5" cy="15" r="1" />
                  </svg>
                </div>
              </PaneResizer>
            {/if}

            {#if isTableActive}
              <Pane defaultSize={40} order={2}>
                <div class="max-h-full overflow-y-scroll">
                  <ParsedTable
                    data={{
                      headers: map.map_data[0].data.fields_info.fields,
                      rows: filtered_data,
                    }}
                  />
                </div>
              </Pane>
            {/if}
          </PaneGroup>
        </Pane>
      {/if}

      {#if isChartActive}
        <PaneResizer
          class="flex h-full w-2 items-center justify-center bg-base-300"
        >
          <div
            class="z-10 flex h-10 w-5 items-center justify-center rounded-sm bg-primary"
          >
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
              class="lucide lucide-grip-vertical text-primary-content"
            >
              <circle cx="9" cy="12" r="1" />
              <circle cx="9" cy="5" r="1" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="15" cy="12" r="1" />
              <circle cx="15" cy="5" r="1" />
              <circle cx="15" cy="19" r="1" />
            </svg>
          </div>
        </PaneResizer>
        <Pane
          defaultSize={isChartActive && !isMapActive && !isTableActive
            ? 100
            : 30}
          order={3}
        >
          <div
            class="flex h-full w-full flex-wrap justify-center gap-5 overflow-y-scroll"
          >
            {#if charts.length > 0}
              {#each charts as chart}
                <SvChartQuery
                  dataset={filtered_data}
                  {...chart}
                  handleDelete={() => {
                    handleDelete(chart.id)
                  }}
                  handleEdit={() => {
                    handleEditChart(chart)
                  }}
                />
              {/each}
            {:else}
              <div
                class="flex w-full items-center justify-center border"
                style="height: calc(100vh - 140px);"
              >
                <h1 class="text-center">
                 {m.you_dont_have_charts()}
                  <button
                    class="text-primary underline"
                    on:click={modalCreateNewChart}
                  >
                    {m.here()}
                  </button>
                  {m.to_create()}
                </h1>
              </div>
            {/if}
          </div>
        </Pane>
      {/if}
    </PaneGroup>
  </div>
</div>

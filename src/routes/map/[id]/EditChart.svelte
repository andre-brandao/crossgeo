<script lang="ts">
  import type { Query } from '$lib/components/map/dataset'
  import { Modal, modal } from '$lib/components/modal'

  import QueryChart from '$lib/components/chart/QueryChart.svelte'
  import SvChartQuery from '$lib/components/SVChartQuery.svelte'
  import FilterComponent from '$lib/components/map/dataset/FilterComponent.svelte'

  import ParsedTable from '$lib/components/table/ParsedTable.svelte'
  import * as m from '$msgs'

  export let dataset: {
    headers: string[]
    rows: Record<string, any>[]
  }
  export let chart: {
    id?: number
    title: string
    filters: {
      label: string
      query: Query
    }[]
    type: string
  }
  export let save: (toSave: typeof chart) => void

  let newFilterValue = ''
  let newFilterField = ''
</script>

<Modal title="Edit Chart #{chart.id ?? ' New Chart'}">
  <div class="flex h-full flex-col gap-3 xl:flex-row">
    <div class="w-full items-center rounded-lg  p-4 shadow xl:w-4/12">
      <SvChartQuery dataset={dataset.rows} {...chart} />
    </div>
    <div class="items-centerw-full flex flex-col rounded  xl:w-8/12">
      <div class="form-control px-4">
        <label for="chart_title" class="label">{m.chart_title()}</label>
        <input
          name="chart_title"
          type="text"
          bind:value={chart.title}
          class="input input-bordered w-full"
        />

        <label for="chart_type" class="label">{m.chart_type()}</label>
        <select
          name="chart_type"
          id="chart_type"
          class="select select-bordered w-full"
          bind:value={chart.type}
        >
          <option value="line">{m.chart_line()}</option>
          <option value="bar">{m.chart_bar()}</option>
          <option value="scatter">Scatter</option>
          <option value="bubble">Bolha</option>
          <option value="pie">Pie</option>
          <option value="radar">Radar</option>
          <!-- <option value="area">{m.chart_area()}</option> -->
        </select>
      </div>
      <div class="my-4 max-h-80 overflow-y-auto">
        <FilterComponent
          fields={dataset.headers}
          query={chart.filters.map(f => f.query)}
          onQueryChange={e => {
            chart.filters = e.map((q, i) => ({
              label: q.value ?? '',
              query: q,
            }))
          }}
          bind:filterValue={newFilterValue}
          bind:filterField={newFilterField}
        />
      </div>
      <button class="btn btn-secondary mx-4 mb-2" on:click={() => save(chart)}>
        {m.save()}
      </button>
    </div>
  </div>

  <div class="my-4 rounded-lg shadow max-h-[500px] overflow-y-scroll">
    <ParsedTable
      data={dataset}
      selectedCell={v => {
        navigator.clipboard.writeText(v)
        newFilterValue = v
      }}
      selectedRow={v => {
        navigator.clipboard.writeText(v)
        newFilterField = v
      }}
    />
  </div>
</Modal>

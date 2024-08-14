<script lang="ts">
  import type { Query } from '$lib/components/map/dataset'
  import { Modal, modal } from '$lib/components/modal'

  import QueryChart from '$lib/components/chart/QueryChart.svelte'

  import FilterComponent from '$lib/components/map/dataset/FilterComponent.svelte'

  import ParsedTable from '$lib/components/table/ParsedTable.svelte'

  export let dataset: {
    headers: string[]
    rows: Record<string, any>[]
  }
  export let chart: {
    title: string
    filters: {
      label: string
      query: Query
    }[]
    type: string
  }
  let newFilterValue = ''
  let newFilterField = ''
</script>

<Modal title="Edit Chart">
  <div>
    <QueryChart dataset={dataset.rows} {...chart} />
  </div>

  <div class="flex flex-col items-center">
    <div>
      <label for="chart_title" class="label">Chart Title</label>
      <input
        name="chart_title"
        type="text"
        bind:value={chart.title}
        class="input input-bordered"
      />

      <label for="chart_type" class="label">Chart Type</label>
      <select
        name="chart_type"
        id="chart_type"
        class="select"
        bind:value={chart.type}
      >
        <option value="line">Line</option>
        <option value="bar">Bar</option>
        <option value="area">Area</option>
      </select>
    </div>
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

  <div>
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

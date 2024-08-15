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
  <div class="mt-3">
    <div class="flex flex-col xl:flex-row gap-3 h-full">
      <div class="w-full lg:w-5/12 border rounded-lg shadow p-4 items-center">
        <QueryChart dataset={dataset.rows} {...chart} />
      </div>
      <div class="flex flex-col items-centerw-full xl:w-7/12 border rounded">
        <div class="form-control px-4">
          <label for="chart_title" class="label">Chart Title</label>
          <input
            name="chart_title"
            type="text"
            bind:value={chart.title}
            class="input input-bordered w-full"
          />
    
          <label for="chart_type" class="label">Chart Type</label>
          <select
            name="chart_type"
            id="chart_type"
            class="select select-bordered w-full"
            bind:value={chart.type}
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="area">Area</option>
          </select>
        </div>
        <div class="overflow-y-auto max-h-80">
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
      </div>
    </div>
  
  
    <div class="shadow my-4 ">
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
  </div>
</Modal>
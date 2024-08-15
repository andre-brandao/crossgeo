<script lang="ts">
  import type {
    SimpleQuery,
    ComplexQuery,
    Query,
    Operator,
  } from '$lib/components/map/dataset'
  import ComplexFilterComponent from './ComplexFilter.svelte'

  export let fields: string[] = []
  export let query: Query[]

  export let onQueryChange: (query: Query[]) => void

  export let filterField = ''
  let filterOperator: Operator = 'eq'
  export let filterValue = ''

  function addSimpleFilter() {
    if (filterField && filterOperator && filterValue) {
      const newFilter: SimpleQuery = {
        field: filterField,
        operator: filterOperator,
        value: filterValue,
      }
      query = [...query, newFilter]
      // filterField = ''
      // filterOperator = 'eq'
      filterValue = ''
      onQueryChange(query)
    }
  }

  function addComplexFilter(operator: 'and' | 'or') {
    const newFilter: ComplexQuery = { operator, queries: [] }
    query = [...query, newFilter]
    onQueryChange(query)
  }

  function removeFilter(index: number) {
    query = query.filter((_, i) => i !== index)
    onQueryChange(query)
  }

  function handleComplexFilterChange(index: number, newFilter: Query) {
    query[index] = newFilter
    onQueryChange(query)
  }
</script>

<div class=" m-4 flex flex-col items-center rounded border p-1">
  <div class=" m-2 flex flex-col xl:flex-row gap-2 items-center space-x-2">
    <select bind:value={filterField} class="select select-primary">
      <option value="" disabled selected>Select Field</option>
      {#each fields as field}
        <option value={field}>{field}</option>
      {/each}
    </select>
    <select
      bind:value={filterOperator}
      class="select select-primary"
      on:change={() => {
        if (filterOperator === 'and' || filterOperator === 'or') {
          addComplexFilter(filterOperator)
          filterOperator = 'eq'
        }
      }}
    >
      <option value="eq">=</option>
      <option value="neq">!=</option>
      <option value="gt">></option>
      <option value="lt">{'<'}</option>
      <option value="gte">>=</option>
      <option value="lte">{'<='}</option>
      <option value="contains">contains</option>
      <!-- <option value="and">AND</option> -->
      <!-- <option value="or">OR</option> -->
    </select>
    {#if filterOperator !== 'and' && filterOperator !== 'or'}
      <input
        type="text"
        bind:value={filterValue}
        placeholder="Value"
        class="input input-primary w-fit"
      />
      <button on:click={addSimpleFilter} class="btn btn-primary">
        Add Filter
      </button>
    {/if}
  </div>

  <ul class="space-y-2">
    {#each query as filter, index}
      <li class="bg-primary-50 flex items-center space-x-2 rounded p-1">
        {#if 'field' in filter}
          <div class="flex items-center space-x-2 flex-col xl:flex-row gap-2">
            <select bind:value={filter.field} class="select select-bordered">
              <option value="" disabled selected>Select Field</option>
              {#each fields as field}
                <option value={field}>{field}</option>
              {/each}
            </select>
            <select bind:value={filter.operator} class="select select-bordered">
              <option value="eq">=</option>
              <option value="neq">!=</option>
              <option value="gt">></option>
              <option value="lt">{'<'}</option>
              <option value="gte">>=</option>
              <option value="lte">{'<='}</option>
              <option value="contains">contains</option>
            </select>
            <input
              type="text"
              bind:value={filter.value}
              placeholder="Value"
              class="input input-bordered"
            />
          </div>
          <button on:click={() => removeFilter(index)} class="btn btn-error">
            Remove
          </button>
        {:else}
          <ComplexFilterComponent
            {fields}
            bind:query={filter}
            onQueryChange={newFilter =>
              handleComplexFilterChange(index, newFilter)}
          />
          <button
            on:click={() => removeFilter(index)}
            class="rounded bg-red-500 p-1 text-white"
          >
            Remove CF
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</div>

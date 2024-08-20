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

<div class=" p-3 bg-base-100 rounded-lg shadow-lg flex flex-col space-y-4 items-center">
  <div class="w-full flex justify-between gap-2 flex-col xl:flex-row">

    <select bind:value={filterField} class="select select-primary w-full sm:w-auto">
      <option value="" disabled selected>Select Field</option>
      {#each fields as field}
        <option value={field}>{field}</option>
      {/each}
    </select>

    <select
      bind:value={filterOperator}
      class="select select-primary w-full sm:w-auto"
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
        class="input input-primary w-full sm:w-auto "
      />
      <button on:click={addSimpleFilter} class="btn btn-primary w-full sm:w-auto">
        Add Filter
      </button>
    {/if}
  </div>

  <ul class="w-full space-y-2">
    {#each query as filter, index}
      <li class="p-2 bg-primary-50 rounded flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {#if 'field' in filter}
          <select bind:value={filter.field} class="select select-bordered w-full sm:w-auto">
            <option value="" disabled selected>Select Field</option>
            {#each fields as field}
              <option value={field}>{field}</option>
            {/each}
          </select>
          <select bind:value={filter.operator} class="select select-bordered w-full sm:w-auto">
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
            class="input input-bordered w-full sm:w-auto "
          />
          <button on:click={() => removeFilter(index)} class="btn btn-error w-full sm:w-auto">
            Remove
          </button>
        {:else}
          <ComplexFilterComponent
            {fields}
            bind:query={filter}
            onQueryChange={newFilter => handleComplexFilterChange(index, newFilter)}
          />
          <button on:click={() => removeFilter(index)} class="btn btn-error w-full sm:w-auto">
            Remove CF
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</div>


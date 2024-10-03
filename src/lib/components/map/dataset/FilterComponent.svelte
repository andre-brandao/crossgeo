<script lang="ts">
  import type {
    SimpleQuery,
    ComplexQuery,
    Query,
    Operator,
  } from '$lib/components/map/dataset'
  import ComplexFilterComponent from './ComplexFilter.svelte'
  import * as m from '$msgs'
  import { toast } from 'svelte-sonner'

  export let fields: string[] = []
  export let query: Query[]

  export let onQueryChange: (query: Query[]) => void

  export let filterField = ''
  let filterOperator: Operator = 'eq'
  export let filterValue = ''

  function addSimpleFilter() {
    // if label exists return
    if (query.find(q => q.value === filterValue)) {
      return toast.error('Duplicate Label')
    }
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

  // function addComplexFilter(operator: 'and' | 'or') {
  //   const newFilter: ComplexQuery = { operator, queries: [] }
  //   query = [...query, newFilter]
  //   onQueryChange(query)
  // }

  function removeFilter(index: number) {
    query = query.filter((_, i) => i !== index)
    onQueryChange(query)
  }

  function handleComplexFilterChange(index: number, newFilter: Query) {
    query[index] = newFilter
    onQueryChange(query)
  }
</script>

<div
  class=" flex flex-col items-center space-y-4 rounded-lg bg-base-100 p-3 shadow-lg"
>
  <div class="flex w-full flex-col justify-between gap-2 xl:flex-row">
    <select
      bind:value={filterField}
      class="select select-primary w-full sm:w-auto"
    >
      <option value="" disabled selected>{m.select_field()}</option>
      {#each fields as field}
        <option value={field}>{field}</option>
      {/each}
    </select>

    <select
      bind:value={filterOperator}
      class="select select-primary w-full sm:w-auto"
      on:change={() => {
        // if (filterOperator === 'and' || filterOperator === 'or') {
        //   addComplexFilter(filterOperator)
        //   filterOperator = 'eq'
        // }
      }}
    >
      <option value="eq">=</option>
      <option value="neq">!=</option>
      <option value="gt">></option>
      <option value="lt">{'<'}</option>
      <option value="gte">>=</option>
      <option value="lte">{'<='}</option>
      <option value="contains">{m.contains()}</option>
      <!-- <option value="and">AND</option>
      <option value="or">OR</option> -->
    </select>

    {#if filterOperator !== 'and' && filterOperator !== 'or'}
      <input
        type="text"
        bind:value={filterValue}
        placeholder="Value"
        class="input input-primary w-full sm:w-auto"
      />
      <button
        on:click={addSimpleFilter}
        class="btn btn-primary w-full sm:w-auto"
      >
        {m.add_filter()}
      </button>
    {/if}
  </div>

  <ul class="w-full space-y-2">
    {#each query as filter, index}
      <li
        class="bg-primary-50 flex flex-col gap-2 rounded p-2 sm:items-center sm:justify-between xl:flex-row"
      >
        {#if 'field' in filter}
          <select
            bind:value={filter.field}
            class="select select-bordered w-full sm:w-auto"
          >
            <option value="" disabled selected>{m.select_field()}</option>
            {#each fields as field}
              <option value={field}>{field}</option>
            {/each}
          </select>
          <select
            bind:value={filter.operator}
            class="select select-bordered w-full sm:w-auto"
          >
            <option value="eq">=</option>
            <option value="neq">!=</option>
            <option value="gt">></option>
            <option value="lt">{'<'}</option>
            <option value="gte">>=</option>
            <option value="lte">{'<='}</option>
            <option value="contains">{m.contains()}</option>
          </select>
          <input
            type="text"
            bind:value={filter.value}
            placeholder="Value"
            class="input input-bordered w-full sm:w-auto"
          />
          <button
            on:click={() => removeFilter(index)}
            class="btn btn-error w-full sm:w-auto"
          >
            {m.remove()}
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
            class="btn btn-error w-full sm:w-auto"
          >
            {m.remove()} CF
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<script lang="ts">
  import type {
    SimpleQuery,
    ComplexQuery,
    Query,
    Operator,
  } from '$lib/components/map/dataset'

  export let fields: string[] = []
  export let query: Query = { operator: 'and', queries: [] }

  export let onQueryChange: (query: Query) => void

  function addSimpleFilter() {
    const newFilter: SimpleQuery = { field: '', operator: 'eq', value: '' }
    ;(query as ComplexQuery).queries = [
      ...(query as ComplexQuery).queries,
      newFilter,
    ]
    onQueryChange(query)
  }

  function addComplexFilter(operator: 'and' | 'or') {
    const newFilter: ComplexQuery = { operator, queries: [] }
    ;(query as ComplexQuery).queries = [
      ...(query as ComplexQuery).queries,
      newFilter,
    ]
    onQueryChange(query)
  }

  function removeFilter(index: number) {
    ;(query as ComplexQuery).queries = (query as ComplexQuery).queries.filter(
      (_, i) => i !== index,
    )
    onQueryChange(query)
  }

  function handleFilterChange(index: number, newFilter: Query) {
    ;(query as ComplexQuery).queries[index] = newFilter
    onQueryChange(query)
  }
</script>

<div class="mb-4 flex items-center space-x-2">
  <select
    bind:value={(query as ComplexQuery).operator}
    class="rounded border p-2"
  >
    <option value="and">AND</option>
    <option value="or">OR</option>
  </select>
  <!-- <button on:click={() => addComplexFilter('and')} class="p-2 bg-green-500 text-white rounded">Add AND Filter</button>
    <button on:click={() => addComplexFilter('or')} class="p-2 bg-green-500 text-white rounded">Add OR Filter</button> -->
  <button on:click={addSimpleFilter} class="rounded bg-blue-500 p-2 text-white">
    Add Simple Filter
  </button>
</div>

<ul class="ml-4 space-y-2">
  {#each (query as ComplexQuery).queries as subquery, index}
    <li class="flex items-center space-x-2">
      {#if 'field' in subquery}
        <div class="flex items-center space-x-2">
          <select bind:value={subquery.field} class="rounded border p-2">
            <option value="" disabled selected>Select Field</option>
            {#each fields as field}
              <option value={field}>{field}</option>
            {/each}
          </select>
          <select bind:value={subquery.operator} class="rounded border p-2">
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
            bind:value={subquery.value}
            placeholder="Value"
            class="rounded border p-2"
          />
        </div>
        <button
          on:click={() => removeFilter(index)}
          class="rounded bg-red-500 p-1 text-white"
        >
          Remove
        </button>
      {:else}
        <svelte:self
          {fields}
          bind:query={subquery}
          onQueryChange={newFilter => handleFilterChange(index, newFilter)}
        />
        <button
          on:click={() => removeFilter(index)}
          class="rounded bg-red-500 p-1 text-white"
        >
          Remove
        </button>
      {/if}
    </li>
  {/each}
</ul>

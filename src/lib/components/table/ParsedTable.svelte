<script lang="ts">
  interface CSVTableProps {
    data: {
      headers: string[]
      rows: Array<{ [key: string]: string } | Record<string, unknown>>
    }
    selectedRow?: (value: string) => void
    selectedCell?: (value: string) => void
  }
  let {
    data,
    selectedRow = v => {},
    selectedCell = v => {},
  }: CSVTableProps = $props()
  console.log(data)

  /**
   * @type {any[]}
   */
  let headers = $state([])
</script>

{#if data}
  <div class="table-container">
    <table class="table table-zebra table-xs min-w-full">
      <thead class="">
        <tr class="sticky top-0 bg-base-200">
          {#each data.headers as header}
            <th class="cursor-pointer" onclick={() => selectedRow(header)}>
              {header}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data.rows as row}
          <tr class="">
            {#each data.headers as header}
              <td
                class=""
                onclick={() => {
                  selectedCell(row[header])
                }}
              >
                {row[header]}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <style>
    .table-container {
      width: 100%;
      max-height: 400px; /* Adjust this value as needed */
      overflow: auto;
    }
    th {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  </style>
{/if}

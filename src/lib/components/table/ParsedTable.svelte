<script lang="ts">
  interface CSVTableProps {
    data: {
      headers: string[]
      rows: Array<{ [key: string]: string } | Record<string, unknown>>
    }
    selectedRow?: (value: string) => void
    selectedCell?: (value: string) => void
  }
  let { data, selectedRow, selectedCell }: CSVTableProps = $props()
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
            <th
              class={selectedRow
                ? 'cursor-pointer hover:bg-primary hover:text-primary-content'
                : ''}
              onclick={() => selectedRow?.(header)}
            >
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
                class={selectedCell
                  ? 'cursor-pointer hover:bg-primary hover:text-primary-content'
                  : ''}
                onclick={() => {
                  const cellVall = row[header]
                  if (cellVall) {
                    selectedCell?.(row[header])
                  }
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
      overflow: auto;
    }
    th {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  </style>
{/if}

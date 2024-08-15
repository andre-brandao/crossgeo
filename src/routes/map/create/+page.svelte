<script lang="ts">
  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'

  import type { PageData } from './$types'
  import ParsedTable from '$lib/components/table/ParsedTable.svelte'
  import Papa from 'papaparse'
  import { toast } from 'svelte-sonner'
  import { goto } from '$app/navigation'
  import Loading from '$lib/components/Loading.svelte'

  export let data: PageData

  let isLoading = false

  let file: File
  let csv_headers: string[] = []
  let csv_data: any[] = []
  let adress_field: string = ''

  let name = ''
  function parseCSV(csvText: string) {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        if (results.meta.fields) {
          csv_headers = results.meta.fields
        }

        csv_data = results.data
        // parsedHeaders(headers)
      },
      error: function (error: any) {
        console.error('Error parsing the CSV:', error)
      },
    })
  }

  function onFileChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement
    },
  ) {
    isLoading = true
    // @ts-ignore
    file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result
      console.log(result)

      const csv_text = result?.toString()
      if (csv_text) parseCSV(csv_text)

      isLoading = false
    }
    reader.readAsText(file)
  }

  async function createMap() {
    if (!name) {
      toast.error('Map name is required')
      return
    }
    if (!adress_field) {
      toast.error('Address field is required')
      return
    }
    if (!csv_data.length) {
      toast.error('No data available. Please upload a CSV file.')
      return
    }
    isLoading = true

    const points = csv_data
      .map(d => ({
        address: d[adress_field],
        meta: d,
      }))
      .filter(d => d.address)
    console.log(points)

    try {
      const resp = await trpc($page).map.creteMap.mutate({
        map: {
          fields_info: {
            address_field: adress_field,
            fields: csv_headers,
          },
          name,
        },
        raw_points: points,
      })
      console.log(resp)
      if (resp.success) {
        goto('/map/' + resp.map.id)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    isLoading = false
  }
</script>

<div class="container mx-auto">
  <!-- Responsive grid layout -->
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <!-- Form Section -->
    <div class="card space-y-3 border p-5">
      <h1
        class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
      >
        Create a map
      </h1>
      <p class=" text-sm">
        Escolha um arquivo csv e o campo com o endereco para começar
      </p>

      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text">Map Name</span>
        </label>
        <input
          type="text"
          id="name"
          class="input input-bordered"
          bind:value={name}
          placeholder="Enter map name"
        />
      </div>

      <div class="form-control">
        <label for="csv" class="label">
          <span class="label-text">CSV File</span>
        </label>
        <input
          type="file"
          name="csv"
          id="csv"
          class="file-input"
          accept=".csv"
          placeholder="Choose CSV file"
          on:change={e => onFileChange(e)}
        />
      </div>

      {#if csv_headers}
        <div class="form-control">
          <label for="address_field" class="label">
            <span class="label-text">Address Field</span>
          </label>
          <select
            name="address_field"
            id="address_field"
            class="select select-bordered"
            bind:value={adress_field}
          >
            {#each csv_headers as item}
              <option value={item}>{item}</option>
            {/each}
          </select>
        </div>
      {:else}
        <p>Selecione um arquivo</p>
      {/if}

      <button class="btn btn-primary" on:click={createMap} disabled={isLoading}>
        {#if isLoading}
          <Loading/>
        {:else}
          <span>Submit</span>
        {/if}
      </button>
      {#if isLoading}
      <p class="text-center text-warning">
        A geocodificacão pode ser um processo demorado, por favor aguarde!
      </p>
      {/if}
    </div>

    <!-- Table Section -->

    <div class="card border p-5">
      <h1
        class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
      >
        Map Data
      </h1>
      <p class=" text-sm">
        Preview dos dados do arquivo CSV, também é possível selecionar o campo
        clicando na coluna
      </p>
      <div class=" mt-2 overflow-auto">
        {#if csv_data && csv_headers}
          <ParsedTable
            data={{
              headers: csv_headers,
              rows: csv_data,
            }}
            selectedRow={s => (adress_field = s)}
          />
        {:else}
          <div class="p-5 text-center">
            <p>No data available. Please upload a CSV file.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

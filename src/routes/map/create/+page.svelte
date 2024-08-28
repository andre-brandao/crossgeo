<script lang="ts">
  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'

  import ParsedTable from '$lib/components/table/ParsedTable.svelte'
  import Papa from 'papaparse'
  import { toast } from 'svelte-sonner'
  import { goto } from '$app/navigation'
  import Loading from '$lib/components/Loading.svelte'
  import * as m from '$msgs'

  import type { AddressInfo, LatLongInfo, FieldsInfo } from '$db/schema'

  let isLoading = false

  let file: File
  let csv_headers: string[] = []
  let csv_data: any[] = []
  let adress_field: string = ''

  let latLongInfo = {
    lat_field: '',
    long_field: '',
  }

  let geocodingType: 'address' | 'lat_long' = 'address'

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

    if (!csv_data.length) {
      toast.error('No data available. Please upload a CSV file.')
      return
    }
    isLoading = true

    switch (geocodingType) {
      case 'address': {
        if (!adress_field) {
          toast.error('Address field is required')
          return
        }
        toast.info('Geocoding by address, please wait, this may take a while')
        const points = csv_data
          .map(d => ({
            address: d[adress_field],
            meta: d,
          }))
          .filter(d => d.address)
        console.log(points)

        try {
          const resp = await trpc($page).map.creteMapGeocoding.mutate({
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
        break
      }
      case 'lat_long': {
        if (!latLongInfo.lat_field || !latLongInfo.long_field) {
          toast.error('Latitude and Longitude fields are required')
          return
        }
        toast.info('Geocoding by lat long')
     

        try {
          const points = csv_data
          .map(d => ({
            lat: d[latLongInfo.lat_field] as number,
            lng: d[latLongInfo.long_field] as number,
            meta: d,
          }))
          .filter(d => d.lat && d.lng)
        console.log(points)
        const resp = await trpc($page).map.createMapLatLong.mutate({
          map: {
            fields_info: {
              lat_field: latLongInfo.lat_field,
              long_field: latLongInfo.long_field,
              fields: csv_headers,
            },
            name,
          },
          raw_points: points,
        })
        if (resp.success) {
          goto('/map/' + resp.map.id)
        }
        } catch (error: any) {
          toast.error(error.message)
        }
      
        break
      }
      default:
        toast.error('Invalid geocoding type')
        break
    }

    isLoading = false
  }
</script>

<div class="container mx-auto mt-5">
  <h1 class="mb-5 text-center text-4xl font-medium">{m.create_a_map()}</h1>
  <!-- Responsive grid layout -->
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <!-- Form Section -->
    <div class="card space-y-3 border p-5">
      <h1
        class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
      >
        {m.create_a_map()}
      </h1>
      <p class=" text-sm">
        {m.choose_csv()}
      </p>

      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text">{m.map_name()}</span>
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
          <span class="label-text">{m.csv_file()}</span>
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

      {#if csv_headers.length > 0}
        <!-- geocoding type select -->
        <div class="form-control">
          <label for="geocodingType" class="label">
            <span class="label-text">{m.geocoding_type()}</span>
          </label>
          <select
            name="geocodingType"
            id="geocodingType"
            class="select select-bordered select-info"
            bind:value={geocodingType}
          >
            <option value="address">{m.address()}</option>
            <option value="lat_long">{m.lat_and_long()}</option>
          </select>
        </div>

        {#if geocodingType === 'address'}
          <div class="form-control">
            <label for="address_field" class="label">
              <span class="label-text">{m.address_field()}</span>
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
          <div class="flex items-center justify-around">
            <div class="form-control">
              <label for="lat_field" class="label">
                <span class="label-text">{m.lat_field()}</span>
              </label>
              <select
                name="lat_field"
                id="lat_field"
                class="select select-bordered"
                bind:value={latLongInfo.lat_field}
              >
                {#each csv_headers as item}
                  <option value={item}>{item}</option>
                {/each}
              </select>
            </div>
            <div class="form-control">
              <label for="long_field" class="label">
                <span
                  class="label-text
                "
                >
                  {m.long_field()}
                </span>
              </label>
              <select
                name="long_field"
                id="long_field"
                class="select select-bordered"
                bind:value={latLongInfo.long_field}
              >
                {#each csv_headers as item}
                  <option value={item}>{item}</option>
                {/each}
              </select>
            </div>
          </div>
        {/if}
      {:else}
        <div class="flex justify-center">
          <p class="badge badge-info text-center text-info-content">
            {m.select_file()}
          </p>
        </div>
      {/if}

      <button class="btn btn-primary" on:click={createMap} disabled={isLoading}>
        {#if isLoading}
          <Loading />
        {:else}
          <span>{m.submit()}</span>
        {/if}
      </button>
      {#if isLoading}
        <p class="text-center text-warning">
          {m.geocoding_slow()}
        </p>
      {/if}
    </div>

    <!-- Table Section -->

    <div class="card border p-5">
      <h1
        class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
      >
        {m.map_data()}
      </h1>
      <p class=" text-sm">
        {m.preview_csv()}
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
            <p>{m.no_data()}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

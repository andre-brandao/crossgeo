<script lang="ts">
  import { icons } from '$lib/utils'
  import Papa from 'papaparse'

  export let data: Record<string, any>

  export let className: string
  // Function to convert data object to CSV format using PapaParse
  const convertToCSV = (obj: Record<string, any>) => {
    const array = recordToArray(obj)

    const csv = Papa.unparse(array) // Convert the object to CSV using PapaParse

    return csv
  }

  // Function to download the CSV
  const downloadCSV = () => {
    const csvData = convertToCSV(data)
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function recordToArray(record: Record<string, any>) {
    return Object.keys(record).map(key => record[key])
  }
</script>

<!-- Button to trigger CSV download -->
<button class={className} on:click={downloadCSV}>{@html icons.download()}Download CSV</button>

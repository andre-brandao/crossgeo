<script>
  /**
   * @type {Record<string, any>}
   */
  export let data

  export let change = (/** @type {number} */ v) => {}
</script>

<!-- <div>
    <button on:click={() => addValue(-1)}> - </button>
    <button on:click={() => addValue(1)}> + </button>
  </div> -->
<div class="w-full text-center font-semibold">
  <div class="container">
    <table class="w-full border-collapse">
      <tbody>
        <!-- {#each Object.entries(data) as [key, value]}
          <tr>
            <th class="border border-black p-2">{key}</th>
            <td class="border border-black p-2">{value}</td>
          </tr>
        {/each} -->
      </tbody>
    </table>
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
</div>

<!-- <style>
    button {
      width: 2rem;
    }
  </style> -->

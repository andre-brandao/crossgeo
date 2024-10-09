<script lang="ts">
  import type { PageData } from './$types'
  //import Map from '$components/map/Map.svelte'
  export let data: PageData
  import L from 'leaflet'
  import map from '$components/map/Map.svelte'

  let points = data.dataSet.points.slice(0, 50)
  let fields = data.dataSet.fields_info.fields.slice(0, 50)
  let info = {
    name: data.dataSet.name,
    createBy: data.dataSet.made_by.username,
  }
</script>

<div class="container mx-auto px-4">
  <div class="-mx-2 flex flex-wrap">
    <div class="md:w-12/12 w-full px-2">
      <div
        class="border-gray mt-3 rounded-lg border-2 px-4 py-5 lg:flex lg:items-center lg:justify-between"
      >
        <div>
          <p>Nome: {info.name}</p>
          <p>Criado pelo usuário: {info.createBy}</p>
        </div>
        <details class="dropdown">
          <summary
            class="fundoBotao btn btn-wide rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Ações
          </summary>
          <ul
            class="menu dropdown-content z-10 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <button
              class="btn-apagar btn"
              on:click={confirmDeleteModel.showModal()}
            >
              <li>Apagar Data Set</li>
            </button>
            <button class="btn mt-2 bg-transparent">
              <li>Adicionar informações</li>
            </button>
          </ul>
        </details>
      </div>
    </div>
  </div>

  <dialog id="confirmDeleteModel" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Tem certeza que deseja apagar?</h3>
      <p class="py-2">Essa ação não pode ser revertida</p>
      <div class="modal-action">
        <button class="btn btn-apagar">Apagar</button>
        <button class="btn bg-primary text-secondary-content">Cancelar</button>
      </div>
    </div>
  </dialog>

  <table class="table-wrapper table table-zebra table-xs mt-3 w-full">
    <thead>
      <tr>
        {#each fields as d}
          <th class="">{d}</th>
        {/each}
        <th
          class="column-default-system bg-primary font-semibold text-secondary-content"
        >
          Latitude
        </th>
        <th
          class="column-default-system bg-primary font-semibold text-secondary-content"
        >
          Longitude
        </th>
      </tr>
    </thead>
    <tbody>
      {#each points as p}
        <tr>
          {#each fields as f}
            <td>
              {p.meta_data?.[f]}
            </td>
          {/each}
          <td class="font-semibold text-primary">
            {p.lat}
          </td>
          <td class="font-semibold text-primary">
            {p.long}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <!-- <pre>
    {JSON.stringify(data, null, 2)}
  </pre> -->
  <!-- TODO: Colocar um estilo diferente para mostrar que faz parte do sistema -->
  <!-- TODO: Olhar responsividade de todos os mapas do sistemas -->
</div>

<style>
  /* sticky top-0 z-20 w-full */
  table {
    position: relative;
  }
  .border-gray {
    border-color: gray !important;
  }
  .column-default-system {
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .border-gray {
    border-color: gray !important;
  }
  .fundoBotao {
    background-color: #18a048;
  }
  .fundoBotao:hover {
    background-color: #15873d;
  }
  .border-gray {
    border-color: gray !important;
  }
  .btn-apagar {
    background-color: #f52929db;
    border-radius: 7px;
    color: #ffffff;
  }
  .btn-apagar:hover {
    background-color: rgb(245, 41, 41);
  }
  .btn-adicionar {
    background-color: #f529295a;
    border-radius: 7px;
    color: #ffffff;
  }
</style>

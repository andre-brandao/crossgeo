<script lang="ts">
  import type { PageData } from './$types'
  import { icons } from '$lib/utils'
  
  export let data: PageData

  function formatarData(data: Date) {
    const dataObj = new Date(data)

    const dia = String(dataObj.getDate()).padStart(2, '0')
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0')
    const ano = dataObj.getFullYear()

    const horas = String(dataObj.getHours()).padStart(2, '0')
    const minutos = String(dataObj.getMinutes()).padStart(2, '0')
    const segundos = String(dataObj.getSeconds()).padStart(2, '0')

    return `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`
  }
</script>

<main>
  <div class="container mx-auto px-5">
    <h1 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">Escolha um dataset para fazer a edição das informações</h1>
    {#each data.dataSet as d}
      <div class="sm:flex sm:items-center justify-center sm:justify-between mt-3 border-2 rounded-sm py-5 px-4 border-gray">
        <div class="min-w-0 flex-1">
          <h2 class="text-xl font-bold leading-7 sm:truncate sm:tracking-tight">
            <a href="/map/dataset/{d.id}">{d.name} afgasdf</a>
          </h2>
          <div
            class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6"
          >
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg
                class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                  clip-rule="evenodd"
                />
              </svg>
              Criado em {d.created_at}
            </div>
          </div>   
        </div>
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="sm:block">
            <a class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" href="/map/{d.id}"
            >
              <svg
                class="-ml-0.5 mr-1.5 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clip-rule="evenodd"
                />
              </svg>
              Visualizar
            </a>
          </span>

          <span class="sm:ml-3">
            <a
              href="/map/dataset/{d.id}"
              class="inline-flex items-center rounded-md fundoBotao px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <svg
                class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z"
                />
              </svg>
              Editar
            </a>
          </span>
        </div>
      </div>
    {/each}
  </div>
  <!-- Lista com os mapas que o cara fez upload -->
  {#if data.dataSet.length == 0}
    <h2>Você não possui datasets disponíveis Clique aqui para adicionar um!</h2>
  {/if}
</main>

<style>
    .border-gray{
        border-color: gray !important;
    }
    .fundoBotao{
        background-color: #18A048;
    }
    .fundoBotao:hover{
        background-color: #15873d;
    }
</style>
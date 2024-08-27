<script>
  import Modal from './base/Modal.svelte'
      import * as m from '$msgs'

  let mensagemWhats = ''
</script>

<Modal title="Solicitar mapa multicamada!">
  <!-- comment form -->
  <form class="w-full max-w-xl rounded-lg px-4 pt-2">
    <div class="-mx-3 mb-6 flex flex-wrap">
      <h2 class=" pb-2 pt-3 text-lg">{m.request_map()}</h2>
      <div class="mb-2 mt-2 w-full md:w-full">
        <textarea
          class="focus:bg-base h-20 w-full resize-none rounded border border-base-300 bg-base-100 px-3 py-2 font-medium leading-normal focus:outline-none"
          name="body"
          placeholder="Digite..."
          required
          bind:value={mensagemWhats}
        ></textarea>
      </div>
      <div class="flex w-full items-center md:w-full">
        <div class="mr-auto flex w-1/2 items-center">
          <svg
            fill="none"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="pt-px text-xs md:text-sm">
            {m.modal_map_custom()}
          </p>
        </div>
        {#if mensagemWhats}
          <a
            href="https://wa.me/5531983861852?text={encodeURI(mensagemWhats)}"
            target="_blank"
            class="btn btn-primary"
          >
            {m.send_message()}
          </a>
        {/if}
      </div>
    </div>
  </form>
</Modal>

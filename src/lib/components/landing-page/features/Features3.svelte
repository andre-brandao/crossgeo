<script>
  import BlurFade from '$lib/components/BlurFade.svelte'
  import { modal } from '$lib/components/modal'
  import ModalMapCreate from '$lib/components/modal/ModalMapCreate.svelte'
  import { icons } from '$lib/utils'
  import * as m from '$msgs'

  let mensagemWhats = ''

  function openFormMapaMulticamada() {
    modal.open(ModalMapCreate)
  }
</script>

<section class="  body-font bg-base-200">
  <div class="container mx-auto px-5 py-24">
    <div
      class="mx-auto mb-10 flex flex-col items-center border-b border-gray-800 pb-10 sm:flex-row lg:w-3/5"
    >
      <BlurFade delay={0.1 * 1.0}>
        <div
          class="inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-base-100 text-primary sm:mr-10 sm:h-32 sm:w-32"
        >
          {@html icons.chart2()}
        </div>
      </BlurFade>
      <div class="mt-6 flex-grow text-center sm:mt-0 sm:text-left">
        <h2 class=" title-font mb-2 text-lg font-medium">{m.charts()}</h2>
        <p class="text-base leading-relaxed">
          {m.desc_charts()}
        </p>
        <!-- <a class="mt-3 inline-flex items-center text-primary">
            Learn More
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a> -->
      </div>
    </div>
    <div
    class="mx-auto mb-10 flex flex-col items-center border-b border-gray-800 pb-10 sm:flex-row lg:w-3/5"
      >
        <div class="mt-6 flex-grow text-center sm:mt-0 sm:text-left">
          <h2 class=" title-font mb-2 text-lg font-medium">
            {m.title_feature_3()}
          </h2>
          <p class="text-base leading-relaxed">
            {m.desc_feature_3()}
          </p>
          <!-- <a class="mt-3 inline-flex items-center text-primary">
            Learn More
            <svg
            fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
            </a> -->
          </div>
          <BlurFade delay={0.1 * 1.5}>
          <div
          class="order-first inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-base-100 text-primary sm:order-none sm:ml-10 sm:h-32 sm:w-32"
        >
          {@html icons.book()}
        </div>
      </BlurFade>
      </div>
      <div class="mx-auto flex flex-col items-center sm:flex-row lg:w-3/5">
        <BlurFade delay={0.1 * 2.0}>
        <div
          class="inline-flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-base-100 text-primary sm:mr-10 sm:h-32 sm:w-32"
        >
          {@html icons.layer()}
        </div>
      </BlurFade>
        <div class="mt-6 flex-grow text-center sm:mt-0 sm:text-left">
          <h2 class=" title-font mb-2 text-lg font-medium">
            {m.title_feature_3_map()}
          </h2>
          <p class="text-base leading-relaxed">
            {m.desc_feature_3_map()}
          </p>
          <button
            class="mt-3 inline-flex items-center text-primary"
            on:click={openFormMapaMulticamada}
          >
            {m.get_in_touch()}
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
  </div>
</section>

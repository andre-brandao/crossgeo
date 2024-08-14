<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'

  import Globe from '$lib/components/landing-page/globe/RotatingGlobe.svelte'

  let geopoints = 200

  $: total = geopoints * 0.25
</script>

<main class="container mx-auto flex flex-col items-center justify-center">
  <div class="h-[30vh] w-full">
    <Globe />
  </div>
  <h1>Checkout</h1>
  <p>Geopoints: {geopoints}</p>
  <div class="flex items-center justify-center gap-4">
    <button
      class="btn btn-error"
      onclick={() =>
        geopoints - 100 > 0 ? (geopoints -= 100) : (geopoints = 100)}
    >
      -100
    </button>

    <button class="btn btn-primary" onclick={() => (geopoints += 100)}>
      +100
    </button>
  </div>

  <p>Total: ${total}</p>
</main>

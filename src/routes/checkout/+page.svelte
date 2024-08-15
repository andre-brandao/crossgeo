<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  import { getUserContext } from '$lib/stores/user'

  const user = getUserContext()
  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'

  import { toast } from 'svelte-sonner'

  import { tweened } from 'svelte/motion'

  import Globe from './PointsMap.svelte'
  import { icons } from '$lib/utils'

  let geopoints = tweened(200, { duration: 500 })

  let total = tweened($geopoints * 25, { duration: 300 })
  $: $total = $geopoints * 25

  async function checkout() {
    try {
      const resp = await trpc($page).checkout.createCheckoutSession.mutate({
        items: [
          {
            price_data: {
              product_data: {
                name: 'Geopoints',
                // description: 'Buy geopoints to use the API',
                images: ['https://via.placeholder.com/150'],
              },
              unit_amount: 25,
            },
            quantity: parseInt($geopoints.toFixed(0)),
          },
        ],
      })
      if (resp.payment_url) {
        window.location.href = resp.payment_url
      } else {
        toast.error('Error creating checkout session')
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
</script>

<h1 class="text-center text-3xl">Buy GeoPoints</h1>
<main class="container mx-auto flex flex-col items-center justify-start">
  <div class="-z-10 h-[15vh] w-full">
    <Globe {data} showPoints={$geopoints} />
  </div>
  <div class="mb-5">
    <h1 class="text-center font-bold shadow-lg">GeoPoints</h1>
    <p
      class="min-w-36 rounded bg-primary bg-opacity-70 p-5 text-center text-2xl font-bold tracking-wide text-primary-content"
    >
      {$geopoints.toFixed(0)}
    </p>
  </div>
  <div class="z-40 my-5 flex items-center justify-center gap-4">
    <button
      class="btn btn-error "
      onclick={() =>
        $geopoints - 100 > 0 ? ($geopoints -= 100) : ($geopoints = 100)}
    >
      -100
    </button>
    <button
      class="btn btn-error "
      onclick={() =>
        $geopoints - 50 > 0 ? ($geopoints -= 50) : ($geopoints = 50)}
    >
      -50
    </button>

    <button class="btn btn-primary" onclick={() => ($geopoints += 50)}>
      +50
    </button>

    <button class="btn btn-primary" onclick={() => ($geopoints += 100)}>
      +100
    </button>
  </div>

  <!-- <p
    class="my-2 max-w-72 text-wrap rounded-lg bg-info bg-opacity-70 p-5 text-justify text-info-content"
  >
    Geopoints are used to buy data from the API. Each point costs $0.25. You
    currently have used {$user?.used_credits} from {$user?.max_credits}
  </p> -->
  <div class="flex gap-2 items-center">
    <p class=" rounded bg-primary p-3 text-2xl text-primary-content bg-opacity-85">
      Total: <span class="font-bold">${($total / 100).toFixed(2)}</span>
    </p>
  
    <button class="rounded bg-secondary p-3 text-2xl text-secondary-content bg-opacity-85 flex items-center gap-2 hover:bg-opacity-70" onclick={checkout}>Checkout {@html icons.cart()}</button>
  </div>
  <div
  class="tooltip z-50 my-5"
  data-tip="Geopoints are used to buy data from the API. Each point costs $0.25. You
  currently have used {$user?.used_credits} from {$user?.max_credits}"
>
  <button class="btn">For what are GeoPoints?</button>
</div>
</main>

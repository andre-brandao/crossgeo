<script lang="ts">
  import type { PageData } from './$types'
  import * as m from '$msgs'

  export let data: PageData
  const { user_maps } = data

  import { getUserContext } from '$lib/stores/user'
  const user = getUserContext()

  const static_map_url = 'https://maps.googleapis.com/maps/api/staticmap'
</script>

<main class="container mx-auto">
  <!-- User Maps Section -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <h2 class="mb-4 text-xl font-semibold">{m.your_maps()}</h2>

      <div>
        {m.used_geopoints()}
        <span class="badge badge-info p-4 text-info-content">
          {$user?.used_credits} / {$user?.max_credits}
        </span>
      </div>
    </div>
    <section
      class="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4"
    >
      {#each user_maps as map}
        <a
          href={`/map/${map.id}`}
          class="group relative overflow-hidden rounded-lg bg-base-300 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
        >
          <img
            src={map.lat && map.long
              ? `${static_map_url}?size=400x300&zoom=12&center=${map.lat},${map.long}&key=${data.GOOGLE_MAPS_KEY}`
              : 'https://generated.vusercontent.net/placeholder.svg'}
            alt="{map.name} Image"
            width="400"
            height="300"
            class="h-64 w-full object-cover"
            style="aspect-ratio: 400 / 300; object-fit: cover;"
          />
          <div class="bg-background p-4">
            <h3 class="text-xl font-bold">{map.name}</h3>
            <p class="text-muted-foreground text-sm">
              {map.created_at}
            </p>
          </div>
        </a>
      {/each}
      <a
        href="/map/create"
        class="group relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
      >
        <div
          class="flex h-full flex-col items-center justify-center bg-info p-4 text-info-content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle-plus"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          <h3 class="text-xl font-bold">{m.create_map()}</h3>
          <p class="text-muted-foreground text-sm">
            {m.click_create()}
          </p>
        </div>
      </a>
    </section>
  </div>
</main>

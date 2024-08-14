<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  const { user_maps, groups } = data

  import { getUserContext } from '$lib/stores/user'
  const user = getUserContext()
</script>

<main class="container mx-auto">
  <!-- User Maps Section -->
  <div class="mb-8">
    <h2 class="mb-4 text-xl font-semibold">Your Maps:</h2>

    <div>
      Seus Geopoints: {$user?.used_credits}/ {$user?.max_credits}
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
            src="https://generated.vusercontent.net/placeholder.svg"
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
          <h3 class="text-xl font-bold">Create New Map</h3>
          <p class="text-muted-foreground text-sm">
            Click here to create a new map.
          </p>
        </div>
      </a>
    </section>
  </div>

  <!-- Groups Section -->
  {#if groups.length > 0}
    <div>
      <h2 class="mb-4 text-xl font-semibold text-gray-800">Seus Grupos:</h2>
      <div class="space-y-8">
        {#each groups as group}
          <div
            class="rounded-lg bg-primary p-6 text-secondary-content shadow-lg"
          >
            <h3 class="mb-4 text-lg font-semibold">{group.group.name}</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {#each group.group.maps as map}
                <a
                  href={`/map/${map.id}`}
                  class="block rounded-lg border bg-secondary p-4 text-secondary-content shadow-md"
                >
                  {map.name}
                </a>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</main>

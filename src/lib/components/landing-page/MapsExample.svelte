<script lang="ts">
  export let maps
  export let GOOGLE_MAPS_KEY
  const static_map_url = 'https://maps.googleapis.com/maps/api/staticmap'

  let gridCols = maps.length % 2 === 0 ? 'lg:grid-cols-2' : 'grid-cols-1'
</script>

<section class=" bg-base-200">
    <div class="container mx-auto max-w-4xl py-40 ">
        <h1 class="flex justify-center mb-6 text-center text-3xl font-bold animate-text-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[200%_auto] bg-clip-text py-2 tracking-tight  xl:text-4xl text-transparent w-full">Exemplos de Mapas</h1>
      
        <div class={`grid ${gridCols} gap-8`}>
          {#each maps as map}
            <a
              href={`/map/${map.id}`}
              class="group relative overflow-hidden rounded-lg bg-base-300 shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl px-2"
            >
              <img
                src={map.lat && map.long
                  ? `https://raw.githubusercontent.com/andre-brandao/crossgeo/refs/heads/main/static/landing-page/map.PNG`
                  : 'https://generated.vusercontent.net/placeholder.svg'}
                alt="{map.name} Image"
                width="400"
                height="300"
                class="h-64 w-full object-cover"
                style="aspect-ratio: 400 / 300; object-fit: cover;"
              />
              <div class="bg-background p-4">
                <h3 class="text-xl font-bold text-primary">{map.name}</h3>
                <p class="text-muted-foreground text-sm">
                  {map.created_at}
                </p>
              </div>
            </a>
          {/each}
        </div>
    </div>
</section>

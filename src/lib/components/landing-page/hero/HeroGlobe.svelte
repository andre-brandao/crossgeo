<script>
  import BlurFade from '$lib/components/BlurFade.svelte'
  import { icons } from '$lib/utils'
  import * as m from '$msgs'
  import { cn } from "$lib/utils";

  import RetroGrid from '../../animation/RetroGrid.svelte'
  import RotatingGlobe from '../globe/RotatingGlobe.svelte'
  import GridPattern from '$lib/components/GridPattern.svelte'
</script>

<div class="flex h-[89vh] items-center justify-center">
  <div
    class=" relative flex size-full h-full items-center justify-center gap-16 overflow-hidden p-14 lg:flex-row flex-col-reverse"
  >
  <GridPattern
  width={20}
  height={20}
  x={-1}
  y={-1}
  class={cn(
    "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
  )}
  fillColor="transparent"
/>
    <div class="flex flex-col gap-2 ">
      <BlurFade delay={0.25}>
        <h1
            class="inline-flex animate-text-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[200%_auto] bg-clip-text text-center text-4xl md:text-5xl lg:text-7xl font-bold text-transparent"
          >
            CrossGeo
          </h1>
      </BlurFade>
      <BlurFade delay={0.25 * 2}>
        <span class="lg:text-xl md:text-lg text-base tracking-widest">Análise espacial de dados</span>
        <div class="flex w-full gap-2 mt-6 lg:flex-row flex-col">
    
          <a href="/map/create" class="relative inline-flex overflow-hidden p-px">
            <span
              class="btn btn-primary inline-flex h-full w-full cursor-pointer items-center justify-center px-4 py-2 text-base lg:text-lg font-medium backdrop-blur-3xl"
            >
            Get Started {@html icons.arrow()}
            </span>
          </a>
          <a href="/" class="relative inline-flex overflow-hidden p-px">
            <span
              class="btn btn-secondary btn-outline inline-flex h-full w-full cursor-pointer items-center justify-center px-4 py-2 text-base lg:text-lg font-medium backdrop-blur-3xl"
            >
              Entre em contato
            </span>
          </a>
        </div>
      </BlurFade>
    </div>
    <BlurFade delay={0.25 * 3}>
    <div style="width: 400px; height: 400px; z-index: 100;">
      <RotatingGlobe />
    </div>
  </BlurFade>
    <!-- <RetroGrid /> -->
  </div>
</div>

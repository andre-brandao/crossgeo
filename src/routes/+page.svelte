<script lang='ts'>
  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'

  import Features3 from '$lib/components/landing-page/features/Features3.svelte'
  import Features4 from '$lib/components/landing-page/features/Features4.svelte'
  import Footer from '$lib/components/landing-page/Footer.svelte'

  import HeroGlobe from '$lib/components/landing-page/hero/HeroGlobe.svelte'
  import GetInTouch from '$lib/components/landing-page/contact/GetInTouch.svelte'
  import CallToAction from '$lib/components/landing-page/CallToAction.svelte'

  import type { PageData } from './$types'
  import MapsExample from '$lib/components/landing-page/MapsExample.svelte'

  export let data: PageData

  let maps = data.user_maps
</script>

<SEO
  {...getSEOProps({
    title: 'Home',
    featuredImage: {
      url: 'https://via.placeholder.com/672x448',
      alt: 'Placeholder image',
      width: 672,
      height: 448,
      caption: 'Home page',
    },
  })}
/>

<!-- <Modal onClose={console.log} onOpen={console.log}>Teste Modal</Modal> -->
<main class="flex flex-col gap-5 overflow-auto">
  <HeroGlobe />

  <Features3></Features3>

  <!-- <Pricing /> -->

  <Features4></Features4>

  <!-- <Carousel /> -->

  <!-- <Carousel2 /> -->
   {#if maps.length>0}
     <MapsExample {maps} GOOGLE_MAPS_KEY={data.GOOGLE_MAPS_KEY}/>
   {/if}

  <CallToAction/>


  <GetInTouch></GetInTouch>

  <Footer></Footer>
</main>

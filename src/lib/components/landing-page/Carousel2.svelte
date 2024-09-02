<script>
  import { onMount, onDestroy } from 'svelte'

  export let images = [
    '/landing-page/mapa-1.png',
    '/landing-page/mapa-2.png',
    '/landing-page/mapas-3.png',
  ]

  let activeIndex = 0
  let carousel

  function scrollToSlide(index) {
    const itemWidth = carousel.querySelector('.carousel-item').offsetWidth
    carousel.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth',
    })
    activeIndex = index
  }

  onMount(() => {
    const interval = setInterval(() => {
      activeIndex = (activeIndex + 1) % images.length
      scrollToSlide(activeIndex)
    }, 3000) // Change slide every 3 seconds

    return () => {
      clearInterval(interval)
    }
  })
</script>

<div
  bind:this={carousel}
  class="carousel w-full overflow-x-hidden whitespace-nowrap rounded-md max-w-[1300px] mt-12"
>
  {#each images as image, index}
    <div
      id={'slide' + (index + 1)}
      class="carousel-item relative inline-block w-full"
    >
      <img src={image} alt={image} class="w-full" />
      <div
        class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between"
      >
        <a
          href={'#slide' + (index === 0 ? images.length : index)}
          class="btn btn-circle"
          on:click|preventDefault={() =>
            scrollToSlide(index === 0 ? images.length - 1 : index - 1)}
        >
          ❮
        </a>
        <a
          href={'#slide' + (index + 2 > images.length ? 1 : index + 2)}
          class="btn btn-circle"
          on:click|preventDefault={() =>
            scrollToSlide((index + 1) % images.length)}
        >
          ❯
        </a>
      </div>
    </div>
  {/each}
</div>
<div class="flex w-full justify-center gap-2 py-2">
  {#each images as _, index}
    <a
      href={'#slide' + (index + 1)}
      class="btn btn-xs"
      on:click|preventDefault={() => scrollToSlide(index)}
    >
      {index + 1}
    </a>
  {/each}
</div>

<style>
  .carousel {
    scroll-behavior: smooth;
  }
  .carousel-item {
    width: 100%;
    flex-shrink: 0;
  }
</style>

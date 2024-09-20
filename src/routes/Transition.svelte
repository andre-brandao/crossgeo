<script>
  import { fade, fly } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'

  import { page, navigating } from '$app/stores'
  import { onNavigate } from '$app/navigation'
  import PreLoadingIndicator from './PreLoadingIndicator.svelte'

  export let key

  onNavigate(navigation => {
    if (!document.startViewTransition) return

    return new Promise(resolve => {
      document.startViewTransition?.(async () => {
        resolve()
        await navigation.complete
      })
    })
  })
</script>

{#if $navigating}
  <PreLoadingIndicator />
{/if}

{#key key}
  <div
    in:fly={{
      duration: 300,
      x: 0,
      y: 240,
      easing: cubicOut,
      delay: 300,
    }}
    out:fly={{ duration: 300, x: 0, y: -240, easing: cubicIn }}
    class="h-full overflow-scroll overflow-x-auto"
  >
    <slot />
  </div>
{/key}

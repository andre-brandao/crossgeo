<script lang="ts">
  export let items = [{ label: 'Home', href: '/login' }]
  import { page } from '$app/stores'

  function isActive(href?: string) {
    return $page.url.pathname === href
  }
</script>

<ul class="tabs flex justify-between">
  {#each items as item}
    <a
      role="tab"
      href={item.href}
      class="tab {isActive(item.href)
        ? 'tab-active bordered border-primary text-primary'
        : ''}"
    >
      {item.label}
    </a>
  {/each}
</ul>

<style>
  .bordered {
    border-color: var(--fallback-p, oklch(var(--p) / var(--tw-border-opacity))) !important;
    --tw-border-opacity: 0.2;
    border-style: solid;
    border-bottom-width: calc(var(--tab-border, 1px) + 1px);
  }
</style>

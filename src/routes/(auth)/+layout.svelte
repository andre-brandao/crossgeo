<script lang="ts">
  import Tabs from '$lib/components/login/Tabs.svelte'

  let tabItems = [
    { label: 'Entrar', href: '/login' },
    { label: 'Entrar com senha', href: '/login/password' },
    { label: 'Cadastre', href: '/signup' },
  ]

</script>

<main>
  <main
    class="flex min-h-[90vh] flex-col items-center justify-center bg-base-200"
  >
    <div class="rounded-lg bg-base-100 p-8 shadow-lg">
      <div class="mb-5">
        <Tabs items={tabItems} />
      </div>
      <slot />
    </div>
  </main>
</main>

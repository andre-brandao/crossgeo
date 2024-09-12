<script lang="ts">
  import * as m from '$msgs'
  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'
  import { enhance } from '$app/forms'

  let isLoading = false

  import type { ActionData } from '../../login/$types'
  import Info from '$lib/components/Info.svelte'
  import { icons } from '$lib/utils'

  export let form: ActionData
</script>

<SEO
  {...getSEOProps({
    title: m.title_sign_in(),
    description: 'Sign in to your account',
  })}
/>


    <!-- <h1 class="text-center text-2xl font-semibold">{m.title_sign_in()}</h1> -->
    <form method="post" use:enhance class="mt-3 flex flex-col gap-4">
      <!-- {#if form?.message && form.success}
        <div class="alert alert-success">{form.message}</div>
      {:else if form?.message}
        <div class="alert alert-error">{form.message}</div>
      {/if} -->
      {#if form}
        <Info {...form} />
      {/if}
      <div></div>
      <div>
        <label class="input input-bordered flex items-center gap-2">
          {@html icons.email()}
          <input name="email" id="email" type="email" class="grow" placeholder="Email" />
        </label>
      </div>

      <button class="btn btn-primary mt-4 w-full" disabled={isLoading}>
        {m.get_magic_link()}
      </button>
    </form>
    <p class="mt-4 text-center text-sm">
      {m.dont_have_acc()}
      <a href="/signup" class="text-primary hover:underline">
        {m.create_an_acc()}
      </a>
    </p>

    <p class="mt-4 text-center text-sm">
      <a href="/login/password" class="btn btn-outline btn-primary">
        {m.login_password()}
      </a>
    </p>


<script lang="ts">
  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'
  import { enhance } from '$app/forms'
  import * as m from '$msgs'
  import Info from '$lib/components/Info.svelte'

  import type { ActionData } from './$types'
  import { icons } from '$lib/utils'

  export let form: ActionData
</script>

<SEO
  {...getSEOProps({
    title: m.title_sign_in(),
    description: 'Sign in using password',
  })}
/>


    <!-- <h1 class="text-center text-2xl font-semibold">{m.title_sign_in()}</h1> -->
    <form method="post" use:enhance class="mt-6 flex flex-col gap-4">
      <!-- {#if form}
        <Info {...form} />
      {/if} -->
      <div>
        <label class="input input-bordered flex items-center gap-2">
          {@html icons.email()}
          <input name="email" id="email" type="email" class="grow" placeholder="Email" />
        </label>
      </div>
      <div>
        <label class="input input-bordered flex items-center gap-2">
          {@html icons.key()}
          <input
            class="grow"
            type="password"
            name="password"
            id="password"
          />
        </label>
      </div>
      <button class="btn btn-primary mt-4 w-full">{m.continu()}</button>
      <!-- <p class=" mt-2 text-center text-sm">{form?.message ?? ''}</p> -->
      {#if form}
        <Info {...form} />
      {/if}
    </form>
    <p class=" text-center text-sm mt-4">
      {m.dont_have_acc()}
      <a href="/signup" class="text-primary hover:underline">
        {m.create_an_acc()}
      </a>
    </p>

    {#if form?.message}
      <p class="mt-2 text-center text-sm">
        {m.forgot_password()}
        <a href="/reset-password" class="text-primary hover:underline">{m.reset_here()}</a>
      </p>
    {/if}


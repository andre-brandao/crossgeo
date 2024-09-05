<script lang="ts">
  import { enhance } from '$app/forms'

  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'

  import * as m from '$msgs'

  import type { ActionData } from './$types'

  export let form: ActionData

  import { mask } from '$utils/mask'

  let phone = '+55 '

  let sending = false
</script>

<SEO
  {...getSEOProps({
    title: m.create_an_account(),
    description: 'Create an account',
  })}
/>

<main class="flex min-h-[90vh] items-center justify-center bg-base-200">
  <div class="w-full max-w-sm rounded-lg bg-base-100 p-8 shadow-lg">
    <h1 class="text-center text-2xl font-semibold">{m.create_an_account()}</h1>
    <form
      method="post"
      use:enhance={() => {
        sending = true
        return ({ update }) => {
          // Set invalidateAll to false if you don't want to reload page data when submitting
          update({ invalidateAll: false }).finally(async () => {
            sending = false
          })
        }
      }}
      class="mt-6 flex flex-col gap-4"
    >
      <div>
        <label for="username" class="block text-sm font-medium">
          {m.username()}
        </label>
        <input
          class="input input-bordered mt-1 w-full"
          name="username"
          id="username"
          type="text"
          disabled={sending}
        />
      </div>
      <div>
        <label for="phone" class="block text-sm font-medium">
          {m.phone()}
        </label>
        <input
          class="input input-bordered mt-1 w-full"
          name="phone"
          id="phone"
          type="tel"
          disabled={sending}
          bind:value={phone}
          use:mask={phone.startsWith('+55')
            ? {
                mask: '+99 (99) 99999-9999',
                disabled: false,
              }
            : {
                mask: '+99999999999999999999',
                disabled: false,
              }}
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input
          class="input input-bordered mt-1 w-full"
          name="email"
          id="email"
          type="email"
          disabled={sending}
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium">
          {m.password()}
        </label>
        <input
          class="input input-bordered mt-1 w-full"
          type="password"
          name="password"
          id="password"
          disabled={sending}
        />
      </div>
      <button disabled={sending} class="btn btn-primary mt-4 w-full">
        {sending ? 'Loaging' : ' Continue'}
      </button>
      <p class=" mt-2 text-center text-sm text-red-500">
        {form?.message ?? ''}
      </p>
    </form>
    <p class="mt-4 text-center text-sm">
      {m.already_have_acc()}
      <a href="/login" class="text-primary hover:underline">
        {m.sign_in()}
      </a>
    </p>
  </div>
</main>

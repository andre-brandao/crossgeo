<script lang="ts">
  import { enhance } from '$app/forms'

  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'

  import * as m from '$msgs'

  import type { ActionData } from './$types'

  export let form: ActionData

  import { mask } from '$utils/mask'
  import { icons } from '$lib/utils'

  let phone = '+55 '

  let sending = false
</script>

<SEO
  {...getSEOProps({
    title: m.create_an_account(),
    description: 'Create an account',
  })}
/>


    <!-- <h1 class="text-center text-2xl font-semibold">{m.create_an_account()}</h1> -->
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

        <label for="username" class="input input-bordered flex items-center gap-2">
          {@html icons.user()}
          <input type="text" class="grow" placeholder="Usuario"name="username"id="username" />
        </label>
       
      </div>
      <!-- <div>
        <label for="phone"  class="input input-bordered flex items-center gap-2">
          {@html icons.phone()}
          <input
            class="grow"
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
        </label>
      </div> -->
      <div>
        <label class="input input-bordered flex items-center gap-2">
          {@html icons.email()}
          <input name="email" id="email" type="email" class="grow" placeholder="Email" disabled={sending}/>
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
            disabled={sending}
          />
        </label>
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

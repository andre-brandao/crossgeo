<script lang="ts">
  import type { PageData } from './$types'
  import OTP from '$components/input/otp/OTP.svelte'

  import SEO, { getSEOProps } from '$lib/components/SEO/index.svelte'
  import * as m from '$msgs'

  export let data: PageData

  import { trpc } from '$trpc/client'
  import { page } from '$app/stores'
  import { toast } from 'svelte-sonner'
  import { goto } from '$app/navigation'

  let code = ''

  let isLoading = false

  let error_message = ''

  async function verifyEmail() {
    isLoading = true
    const { error, data } = await trpc($page).auth.verifyEmail.query({
      code,
    })

    if (error) {
      error_message = error
      toast.error(error)
      isLoading = false
      return
    }

    if (data?.success) {
      goto('/')
    }
  }

  let resendDelay = 60
  let timeLeft = resendDelay
  let timer: number | undefined = undefined
  let canResend = true
  async function resendEmail() {
    if (!canResend) return
    const { message } = await trpc($page).auth.resendEmailVerification.query()
    toast(message)
    startResendTimer()
    timeLeft = resendDelay
    canResend = false
  }

  function startResendTimer() {
    timer = window.setInterval(() => {
      timeLeft -= 1

      if (timeLeft <= 0) {
        clearInterval(timer)
        canResend = true
      }
    }, 1000)
  }
</script>

<SEO
  {...getSEOProps({
    title: 'Verify Email',
    description:
      'Enter the 8-digit verification code sent to your email address.',
  })}
/>

<div class="bg-background flex h-full flex-col items-center justify-center">
  <div class="mx-auto w-full max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold">{m.verify_email()}</h1>
      <p class="text-muted-foreground mt-2">
        {m.enter_8_digit()}
      </p>
    </div>
    <div
      class="bg-card text-card-foreground rounded-lg border border-primary shadow-sm"
      data-v0-t="card"
    >
      <div class="space-y-4 p-6">
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="code"
          >
            {m.cod_verify()}
          </label>
          <!-- <input
            bind:value={code}
            class="input input-bordered w-full disabled:cursor-not-allowed disabled:opacity-50"
            id="code"
            pattern="[0-9]*"
            inputmode="numeric"
            maxlength="8"
            placeholder="12345678"
            type="text"
          /> -->
          <div class="flex items-center justify-center">
            <OTP bind:value={code} numOfInputs={8} inputClass="" numberOnly />
          </div>

          <button
            disabled={isLoading}
            onclick={verifyEmail}
            class="btn btn-outline w-full"
          >
            {m.verify_email}
          </button>

          <div>
            {#if canResend}
              {m.didnt_receive()}
              <button
                class="link"
                onclick={resendEmail}
                disabled={isLoading || !canResend}
              >
                {m.resend()}
              </button>
            {:else}
              {m.resend_in()} {timeLeft} {m.seconds()}
            {/if}
          </div>

          {#if error_message}
            <p>{error_message}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

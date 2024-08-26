<script lang="ts">
  import { Modal, modal } from '$lib/components/modal'

  interface Props {
    title?: string
    text: string
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
  }

  const { title = 'Alert!!!!', text, onCancel, onConfirm }: Props = $props()

  async function confirm() {
    modal.close()
    if (onConfirm) {
      await onConfirm()
    }
  }

  function cancel() {
    modal.close()
    onCancel?.()
  }
</script>

<Modal {title}>
  <p>{text}</p>

  <div class="m-5 flex items-center justify-around">
    {#if onConfirm}
      <button class="btn btn-success" onclick={confirm}>Confirm</button>
    {/if}
    <button class="btn btn-error" onclick={cancel}>
      {onCancel ? 'Cancel' : 'Close'}
    </button>
  </div>
</Modal>

<script lang="ts">
  import type { ModalProps } from '$lib/components/types';
  import { fade, scale } from 'svelte/transition';

  let {
    class: className,
    id,
    children,
    show = $bindable(false),
    center = false,
  }: ModalProps = $props();
</script>

{#if show}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="modal-backdrop" onclick={() => (show = false)}></div>
  <div in:fade={{ duration: 200 }} out:fade={{ duration: 300 }}>
    <div
      class={['modal', center && 'text-center', className]}
      {id}
      in:scale={{ duration: 200, start: 0.75 }}
      out:scale={{ duration: 300, start: 0.75 }}
    >
      {@render children()}
    </div>
  </div>
{/if}

<style lang="postcss">
  @reference "@/app.css";

  .modal-backdrop {
    @apply fixed inset-0 z-20 bg-transparent;
  }

  .modal {
    @apply fixed top-1/2 left-1/2 z-30 flex -translate-1/2 flex-col gap-6 rounded-md border border-gray-700 bg-gray-900 p-4 drop-shadow-xl drop-shadow-black/90 transition-all md:p-8;
  }

  .modal.modal-show {
    @apply scale-100 opacity-100 duration-200;
  }

  .modal.modal-hidden {
    @apply scale-75 opacity-0 duration-300;
  }
</style>

<script lang="ts">
  import type { ModalProps } from '$lib/components/types';
  import { fade, scale } from 'svelte/transition';

  let {
    class: className,
    id,
    children,
    show = false,
    center = false,
    backdropCallback,
  }: ModalProps = $props();
</script>

{#if show}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-40 bg-gray-900/40"
    onclick={backdropCallback}
    out:fade={{ duration: 300 }}
  ></div>
  <div in:fade={{ duration: 200 }} out:fade={{ duration: 300 }}>
    <div
      class={[
        'fixed top-1/2 left-1/2 z-50 flex w-11/12 -translate-1/2 flex-col gap-4 rounded-md border border-gray-400 bg-gray-200 p-4 drop-shadow-xl drop-shadow-black/30 transition-all md:max-w-1/2 md:p-6 dark:border-gray-700 dark:bg-gray-900 dark:drop-shadow-black/90',
        center && 'text-center',
        className,
      ]}
      {id}
      in:scale={{ duration: 200, start: 0.75 }}
      out:scale={{ duration: 300, start: 0.75 }}
    >
      {@render children()}
    </div>
  </div>
{/if}

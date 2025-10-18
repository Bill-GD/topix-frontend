<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { fade, scale } from 'svelte/transition';

  let {
    class: className,
    id,
    children,
    show = false,
    center = false,
    upper = false,
    backdropCallback,
  }: {
    class?: ClassValue;
    id?: string;
    children: Snippet;
    icon?: Snippet;
    show: boolean;
    center?: boolean;
    upper?: boolean;
    backdropCallback: VoidFunction;
  } = $props();
</script>

{#if show}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class={['fixed inset-0 bg-zinc-700/40 dark:bg-zinc-800/40', upper ? 'z-12' : 'z-10']}
    onclick={backdropCallback}
    out:fade={{ duration: 300 }}
  ></div>
  <div in:fade={{ duration: 200 }} out:fade={{ duration: 300 }}>
    <div
      class={[
        'fixed top-1/2 left-1/2 flex w-11/12 -translate-1/2 flex-col gap-4 box transition-all md:max-w-1/2 md:p-6 dark:border-gray-700 dark:bg-zinc-900',
        upper ? 'z-13' : 'z-11',
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

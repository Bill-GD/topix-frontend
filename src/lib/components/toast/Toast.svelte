<script lang="ts">
  import type { ToastProps } from '$lib/components/types';
  import { onMount } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { fade, slide } from 'svelte/transition';
  import Icon from '../misc/Icon.svelte';

  let { class: className, toast }: ToastProps = $props();

  const types: { [toast.type]: [ClassValue, ClassValue, string] } = {
    success: ['border-green-500', 'text-green-500', 'success'],
    error: ['border-red-500', 'text-red-700', 'error'],
  };

  let mounted = $state<boolean>(false);
  onMount(() => {
    mounted = true;
    setTimeout(() => (mounted = false), 4000);
  });
</script>

{#if mounted}
  <div
    class={[
      'flex w-fit items-center gap-2 rounded-md border-2 bg-zinc-100 p-3 dark:bg-zinc-950',
      types[toast.type][0],
      className,
    ]}
    in:slide={{ duration: 200 }}
    out:fade={{ duration: 300 }}
  >
    <Icon class={['mx-2 py-1', types[toast.type][1]]} size="lg" type={types[toast.type][2]} />
    <p class={['font-semibold', types[toast.type][1]]}>
      {toast.message}
    </p>
  </div>
{/if}

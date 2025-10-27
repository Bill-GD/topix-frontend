<script lang="ts">
  import type { ToastMessage } from '$lib/utils/types';
  import { onMount } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { fade, slide } from 'svelte/transition';
  import Icon from '../misc/Icon.svelte';

  let {
    class: className,
    toast,
  }: {
    class?: ClassValue;
    toast: ToastMessage;
  } = $props();

  const types: { [toast.type]: [ClassValue, 'success' | 'info' | 'error'] } = {
    success: ['text-green-500', 'success'],
    error: ['text-red-700', 'error'],
    info: ['text-sky-600', 'info'],
  };

  let mounted = $state<boolean>(false);
  onMount(() => {
    mounted = true;
    setTimeout(() => (mounted = false), 4000);
  });
</script>

{#if mounted}
  <div
    class={['flex w-fit items-center gap-2 box dark:bg-zinc-950', className]}
    in:slide={{ duration: 200 }}
    out:fade={{ duration: 300 }}
  >
    <Icon class={['mx-2 py-1', types[toast.type][0]]} size="lg" type={types[toast.type][1]} />
    <p class={['font-semibold', types[toast.type][0]]}>
      {@html toast.message}
    </p>
  </div>
{/if}

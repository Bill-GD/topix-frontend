<script lang="ts">
  import type { ToastMessage } from '$lib/utils/types';
  import { onMount } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { fade, fly } from 'svelte/transition';
  import Icon from '../misc/Icon.svelte';

  let {
    class: className,
    toast,
    persistent = false,
  }: {
    class?: ClassValue;
    toast: ToastMessage;
    persistent?: boolean;
  } = $props();

  const types: {
    [toast.type]: {
      fg: ClassValue;
      border: ClassValue;
      bg: ClassValue;
      icon: 'success' | 'info' | 'error';
    };
  } = {
    success: {
      fg: 'text-green-500',
      border: 'border-green-500',
      bg: 'bg-green-50',
      icon: 'success',
    },
    error: { fg: 'text-red-600', border: 'border-red-600', bg: 'bg-red-50', icon: 'error' },
    info: { fg: 'text-sky-600', border: 'border-sky-600', bg: 'bg-sky-50', icon: 'info' },
  };

  let mounted = $state<boolean>(false);
  onMount(() => {
    mounted = true;
    if (!persistent) setTimeout(() => (mounted = false), 4000);
  });
</script>

{#if mounted}
  <div
    class={[
      'flex w-fit items-center gap-2 rounded-lg border-l-5 p-4 box-shadow',
      types[toast.type].border,
      types[toast.type].bg,
      className,
    ]}
    in:fly={{ duration: 200, x: -200 }}
    out:fade={{ duration: 300 }}
  >
    <Icon class={['mx-1 py-1', types[toast.type].fg]} size="lg" type={types[toast.type].icon} />
    <p class={[types[toast.type].fg]}>
      {@html toast.message}
    </p>
  </div>
{/if}

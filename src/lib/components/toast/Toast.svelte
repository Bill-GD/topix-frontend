<script lang="ts">
  import type { ToastProps } from '$lib/components/types';
  import Icon from '../misc/Icon.svelte';
  import { fade, slide } from 'svelte/transition';

  let { class: className, toast }: ToastProps = $props();

  const types: { [toast.type]: [string, typeof toast.type] } = {
    success: ['text-green-500', 'success'],
    info: ['text-sky-600', 'info'],
    error: ['text-red-700', 'error'],
  };
</script>

<div
  class={['main', types[toast.type][1], className]}
  in:slide={{ duration: 300 }}
  out:fade={{ duration: 300 }}
>
  <Icon class={types[toast.type][0]} type={types[toast.type][1]} />
  <p class={['font-semibold', types[toast.type][0]]}>
    {toast.message}
  </p>
</div>

<style lang="postcss">
  @reference "@/app.css";

  .main {
    @apply flex w-fit items-center gap-2 rounded-md border-2 bg-gray-950 p-3;
  }
  .main.success {
    @apply border-green-500;
  }
  .main.error {
    @apply border-red-500;
  }
  .main.info {
    @apply border-sky-500;
  }
</style>

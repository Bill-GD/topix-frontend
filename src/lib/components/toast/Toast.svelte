<script lang="ts">
  import type { ToastProps } from '$lib/components/types';
  import type { ClassValue } from 'svelte/elements';
  import { fade, slide } from 'svelte/transition';
  import Icon from '../misc/Icon.svelte';

  let { class: className, toast }: ToastProps = $props();

  const types: { [toast.type]: [ClassValue, ClassValue, string] } = {
    success: ['border-green-500', 'text-green-500', 'success'],
    info: ['border-sky-500', 'text-sky-600', 'info'],
    error: ['border-red-500', 'text-red-700', 'error'],
  };
</script>

<div
  class={[
    'flex w-fit items-center gap-2 rounded-md border-2 bg-gray-950 p-3',
    types[toast.type][0],
    className,
  ]}
  in:slide={{ duration: 300 }}
  out:fade={{ duration: 300 }}
>
  <Icon class={['mx-2 py-1', types[toast.type][1]]} size="lg" type={types[toast.type][2]} />
  <p class={['font-semibold', types[toast.type][1]]}>
    {toast.message}
  </p>
</div>

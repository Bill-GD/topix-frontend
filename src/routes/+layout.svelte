<script lang="ts">
  import { Toast, getToaster, initToaster } from '$lib/components/toast';
  import { getTheme, initTheme } from '$lib/utils/theme.svelte';
  import '@/app.css';
  import 'tippy.js/dist/tippy.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  initToaster();
  initTheme();

  const toaster = getToaster();
  const theme = getTheme();
</script>

<div class={[theme.isDark && 'dark']}>
  {@render children()}
</div>

{#if toaster.toasts.length > 0}
  <div class="fixed bottom-0 left-0 z-50 m-4 flex flex-col gap-2">
    {#each toaster.toasts as toast (toast.id)}
      <Toast {toast} />
    {/each}
  </div>
{/if}

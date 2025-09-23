<script lang="ts">
  import '@/app.css';
  import 'tippy.js/dist/tippy.css';
  import type { LayoutProps } from './$types';
  import { Toast, getToaster, initToaster } from '$lib/components/toast';

  let { children }: LayoutProps = $props();
  initToaster();
  const toaster = getToaster();
</script>

{@render children()}

{#if toaster.toasts.length > 0}
  <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
    {#each toaster.toasts as toast (toast.id)}
      <Toast {toast} />
    {/each}
  </div>
{/if}

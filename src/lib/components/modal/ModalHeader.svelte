<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let { class: className, children }: { children: Snippet; class?: ClassValue } = $props();
</script>

<div class={['modal-header', className]}>
  {@render children()}
</div>

<style lang="postcss">
  @reference "@/app.css";

  .modal-header {
    @apply line-clamp-1 text-xl font-semibold;
  }
</style>

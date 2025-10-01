<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let { children, class: className }: { children: Snippet; class?: ClassValue } = $props();
</script>

<div class={['modal-content', className]}>
  {@render children()}
</div>

<style lang="postcss">
  @reference "@/app.css";

  .modal-content {
    @apply text-gray-300;
  }
</style>

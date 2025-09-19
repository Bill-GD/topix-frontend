<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="modal-header">
  {@render children()}
</div>

<style lang="postcss">
  @reference "@/app.css";

  .modal-header {
    @apply line-clamp-1 text-xl font-semibold;
  }
</style>

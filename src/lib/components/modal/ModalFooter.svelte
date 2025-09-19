<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="modal-controls">
  {@render children()}
</div>

<style lang="postcss">
  @reference "@/app.css";

  .modal-controls {
    @apply flex flex-col items-center gap-4 md:flex-row-reverse md:justify-start;
  }
</style>

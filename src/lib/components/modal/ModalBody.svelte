<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="modal-content">
  <p class="align-middle">
    {@render children()}
  </p>
</div>

<style lang="postcss">
  @reference "@/app.css";

  .modal-content {
    @apply text-gray-300;
  }
</style>

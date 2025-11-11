<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

{#if !children}
  <hr class="text-zinc-300 dark:text-zinc-700" />
{:else}
  <div class="flex items-center gap-2">
    <hr class="flex-grow-1 text-zinc-300 dark:text-zinc-700" />
    <p class="text-sm">{@render children()}</p>
    <hr class="flex-grow-1 text-zinc-300 dark:text-zinc-700" />
  </div>
{/if}

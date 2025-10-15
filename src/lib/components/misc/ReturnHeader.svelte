<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconButton from '../button/IconButton.svelte';
  import Icon from './Icon.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- <div class="sticky top-0 border-r border-b border-gray-700 bg-zinc-950 py-4 text-center text-2xl"> -->
<div
  class="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-400 bg-zinc-50 p-2 dark:border-gray-700 dark:bg-zinc-950"
>
  <IconButton
    class="hover:bg-zinc-200 dark:hover:bg-zinc-800"
    onclick={() => window.history.back()}
  >
    <Icon type="back" size="sm" />
  </IconButton>
  <span class="text-lg font-semibold">{@render children()}</span>
</div>

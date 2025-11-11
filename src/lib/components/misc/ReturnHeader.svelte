<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';
  import Button from '../button/Button.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<!-- <div class="sticky top-0 border-r border-b border-gray-700 bg-zinc-950 py-4 text-center text-2xl"> -->
<div class="flex items-center gap-4 py-2">
  <Button round onclick={() => window.history.back()}>
    <Icon type="back" size="sm" />
  </Button>
  <span class="text-lg font-semibold">{@render children()}</span>
</div>

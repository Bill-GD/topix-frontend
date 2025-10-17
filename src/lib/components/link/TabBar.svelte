<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let { children, class: className }: { children: Snippet; class?: ClassValue } = $props();
</script>

<div class={['flex gap-2 overflow-x-clip dark:bg-zinc-950', className]}>
  {@render children()}
</div>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let { children, class: className }: { children: Snippet; class?: ClassValue } = $props();
</script>

<div class={['dark:text-gray-300', className]}>
  {@render children()}
</div>

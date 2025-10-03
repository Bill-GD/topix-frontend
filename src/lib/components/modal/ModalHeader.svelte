<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let { class: className, children }: { children: Snippet; class?: ClassValue } = $props();
</script>

<div class={['line-clamp-1 text-xl font-semibold', className]}>
  {@render children()}
</div>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-col items-center gap-4 md:flex-row-reverse md:justify-start">
  {@render children()}
</div>

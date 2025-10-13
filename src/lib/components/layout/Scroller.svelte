<script lang="ts">
  import { type Snippet } from 'svelte';

  let { children, disabled, ...props }: { children: Snippet; disabled?: boolean } = $props();
</script>

<div class="py-3 text-center text-gray-200" {...props}>
  {@render children()}
</div>

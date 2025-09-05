<script lang="ts">
  import Icon from './Icon.svelte';
  import type { ErrorProps } from './types';

  let { children, class: className }: ErrorProps = $props();
</script>

<div class="flex items-center rounded-lg border-2 border-red-500 bg-red-200 p-3 {className}">
  <Icon class="flex-1/6" type="error"></Icon>
  <p class="flex-5/6 font-semibold text-red-500">
    {@render children()}
  </p>
</div>

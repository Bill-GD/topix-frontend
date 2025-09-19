<script lang="ts">
  import Icon from '../misc/Icon.svelte';
  import type { ErrorProps } from '$lib/components/types';

  let { children, class: className }: ErrorProps = $props();
</script>

<div class={['boundary', className]}>
  <Icon class="flex-1/6 text-red-500" type="error" />
  <p class="text-content">
    {@render children()}
  </p>
</div>

<style lang="postcss">
  @reference "@/app.css";

  .boundary {
    @apply flex items-center rounded-lg border-2 border-red-500 bg-red-200 p-3;
  }

  .text-content {
    @apply flex-5/6 font-semibold text-red-500;
  }
</style>

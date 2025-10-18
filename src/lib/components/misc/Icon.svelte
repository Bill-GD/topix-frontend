<script lang="ts">
  import { Icons } from '$lib/components/types';
  import type { ClassValue } from 'svelte/elements';

  const IconSize = {
    xs: ['h-4', 'w-4'],
    sm: ['h-5', 'w-5'],
    md: ['h-6', 'w-6'],
    lg: ['h-8', 'w-8'],
  };

  let {
    type,
    hover = false,
    size = 'md',
    class: className,
  }: {
    type: keyof typeof Icons;
    hover?: boolean;
    size?: keyof typeof IconSize;
    class?: ClassValue;
  } = $props();

  const icon = $derived(Icons[type].icon);
</script>

{#if icon[4]}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class={['transition-transform', hover && 'hover:scale-150', ...IconSize[size], className]}
    viewBox="0 0 {icon[0]} {icon[1]}"
    role="img"
  >
    <g>
      {#if typeof icon[4] == 'string'}
        <path d={icon[4]} fill={'currentColor'} />
      {/if}
    </g>
  </svg>
{/if}

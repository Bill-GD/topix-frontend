<script lang="ts">
  import type { DropdownItemProps } from '$lib/components/types';

  let {
    href,
    children,
    rel,
    noHover = false,
    onclick,
    class: className,
  }: DropdownItemProps = $props();
</script>

<li>
  {#if href}
    <a
      class={[
        'block w-max min-w-full px-4 py-2',
        !noHover && 'hover:bg-gray-400/50 dark:hover:bg-gray-700',
        className,
      ]}
      {href}
      {rel}
      {onclick}
    >
      {@render children()}
    </a>
  {:else}
    <button
      class={[
        'block w-full cursor-pointer px-4 py-2 text-left',
        !noHover && 'hover:bg-gray-400/50 dark:hover:bg-gray-700',
        className,
      ]}
      {onclick}
    >
      {@render children()}
    </button>
  {/if}
</li>

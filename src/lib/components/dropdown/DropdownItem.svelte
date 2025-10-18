<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let {
    href,
    children,
    rel,
    noHover = false,
    onclick,
    class: className,
  }: {
    children: Snippet;
    href?: string;
    rel?: string;
    class?: ClassValue;
    noHover?: boolean;
    onclick?: VoidFunction;
  } = $props();
</script>

<li>
  {#if href}
    <a
      class={[
        'block w-max min-w-full rounded-md px-3 py-2',
        !noHover && 'hover:bg-zinc-200 dark:hover:bg-zinc-700',
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
        'block w-full cursor-pointer rounded-md px-3 py-2 text-left',
        !noHover && 'hover:bg-zinc-200 dark:hover:bg-zinc-700',
        className,
      ]}
      {onclick}
    >
      {@render children()}
    </button>
  {/if}
</li>

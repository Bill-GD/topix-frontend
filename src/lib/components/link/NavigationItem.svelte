<script lang="ts">
  import { tooltip } from '$lib/utils/helpers';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let {
    title,
    href,
    inHeader = false,
    isCurrent = false,
    noPadding = false,
    children,
    class: className,
  }: {
    title: string;
    href: string;
    children: Snippet;
    class?: ClassValue;
    inHeader?: boolean;
    isCurrent?: boolean;
    noPadding?: boolean;
  } = $props();
</script>

{#if inHeader}
  <a
    class={[
      'flex justify-center rounded-md',
      isCurrent
        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200/80 dark:bg-sky-700/15 dark:hover:bg-sky-700/25'
        : 'hover:bg-zinc-200 dark:hover:bg-zinc-800',
      !noPadding && 'flex-grow-1 py-2',
      className,
    ]}
    {href}
    {@attach tooltip(title, 'bottom')}
  >
    {@render children()}
  </a>
{:else}
  <a
    class={[
      'flex h-fit w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800',
      isCurrent && 'font-semibold text-blue-600',
      className,
    ]}
    {href}
  >
    {@render children()}
    <span class="text-xl">{title}</span>
  </a>
{/if}

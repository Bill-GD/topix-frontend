<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let {
    title,
    href,
    children,
    class: className,
  }: {
    title: string;
    href: string;
    children: Snippet;
    class?: ClassValue;
  } = $props();
</script>

<a
  class={[
    'flex h-fit w-full cursor-pointer items-center gap-3 rounded-md p-3 py-2 hover:bg-zinc-300 dark:hover:bg-zinc-800/80',
    className,
  ]}
  {href}
>
  {@render children()}
  <span class="text-xl dark:text-white">{title}</span>
</a>

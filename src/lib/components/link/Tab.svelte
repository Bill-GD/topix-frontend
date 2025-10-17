<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    href,
    selected = false,
  }: {
    children: Snippet;
    href: string;
    selected: boolean;
  } = $props();
</script>

<a
  class={[
    'flex-1 rounded-md px-4 py-2 text-center',
    selected ? 'box font-semibold' : 'text-gray-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/40',
  ]}
  {href}
  data-sveltekit-replacestate
>
  {@render children()}
</a>

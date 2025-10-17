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
    selected
      ? 'bg-zinc-50 font-semibold box-drop-shadow dark:bg-zinc-800/40 dark:text-gray-300'
      : 'bg-zinc-200 text-gray-500',
  ]}
  {href}
  data-sveltekit-replacestate
>
  {@render children()}
</a>

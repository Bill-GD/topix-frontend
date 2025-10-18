<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue, HTMLAttributeAnchorTarget } from 'svelte/elements';

  let {
    children,
    href,
    target,
    class: className,
  }: {
    href?: string | null;
    class?: ClassValue;
    target?: HTMLAttributeAnchorTarget | null;
    children: Snippet;
  } = $props();
</script>

<a
  class={[
    'cursor-pointer text-sky-600 visited:text-purple-800 hover:text-sky-500 active:text-sky-500 active:underline',
    className,
  ]}
  {target}
  {href}
>
  {@render children()}
</a>

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
    'cursor-pointer text-blue-600 hover:text-blue-500 active:text-blue-500 active:underline',
    className,
  ]}
  {target}
  {href}
>
  {@render children()}
</a>

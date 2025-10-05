<script lang="ts">
  import type { LinkProps } from '$lib/components/types';

  let { children, href, target, class: className }: LinkProps = $props();
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

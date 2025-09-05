<script lang="ts">
  import type { LinkProps } from './types';

  let { children, href, target, class: className }: LinkProps = $props();
</script>

<a
  class="text-sky-500 visited:text-purple-800 hover:text-sky-700 active:text-sky-700 active:underline {className}"
  {target}
  {href}
>
  {@render children()}
</a>

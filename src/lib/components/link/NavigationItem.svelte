<script lang="ts">
  import type { NavItemProps } from '$lib/components/types';

  let props: NavItemProps = $props();
</script>

<a
  class={[
    'flex h-fit w-full cursor-pointer items-center gap-3 rounded-md p-3 py-2 hover:bg-zinc-300 dark:hover:bg-zinc-800/80',
    props.class,
  ]}
  href={props.href}
>
  {@render props.children()}
  <span class="text-xl dark:text-white">{props.title}</span>
</a>

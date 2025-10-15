<script lang="ts">
  import type { NavItemProps } from '$lib/components/types';

  let props: NavItemProps = $props();
</script>

<a
  class={[
    'flex h-fit cursor-pointer items-center gap-3 rounded-full p-3 hover:bg-zinc-300 md:w-full md:rounded-md md:py-2 dark:hover:bg-zinc-900',
    props.class,
  ]}
  href={props.href}
>
  {@render props.children()}
  <span class="hidden text-xl lg:inline dark:text-white">{props.title}</span>
</a>

<script lang="ts">
  import type { NavItemProps } from '$lib/components/types';

  let props: NavItemProps = $props();
</script>

<a
  class={[
    'flex h-fit w-fit cursor-pointer items-center justify-end gap-3 rounded-full p-3 hover:bg-gray-200 md:py-2 dark:hover:bg-gray-900',
    props.class,
  ]}
  href={props.href}
>
  <span class="hidden text-2xl lg:inline dark:text-white">{props.title}</span>
  {@render props.children()}
</a>

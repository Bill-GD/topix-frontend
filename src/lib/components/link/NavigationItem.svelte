<script lang="ts">
  import type { NavItemProps } from '$lib/components/types';

  let props: NavItemProps = $props();
</script>

<a
  class={[
    'flex h-fit w-fit cursor-pointer items-center justify-end gap-3 rounded-full p-3 hover:bg-gray-900 active:bg-gray-900 md:py-2',
    props.class,
  ]}
  href={props.href}
>
  <span class="hidden text-2xl text-white lg:inline">{props.title}</span>
  {@render props.children()}
</a>

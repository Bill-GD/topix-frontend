<script lang="ts">
  import type { NavItemProps } from '@/utils/component-types';
  import type { Snippet } from 'svelte';

  let props: NavItemProps & { children: Snippet } = $props();
</script>

<a
  class="flex w-fit cursor-pointer items-center justify-end gap-3 rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full"
  href={props.href}
>
  <span class="hidden text-2xl text-white lg:inline">{props.title}</span>
  {@render props.children()}
</a>

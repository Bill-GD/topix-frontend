<script lang="ts">
  import type { NavItemProps } from '@/utils/component-types';
  import type { Snippet } from 'svelte';

  let props: NavItemProps & { children: Snippet } = $props();
</script>

<a
  class="flex w-full cursor-pointer items-center justify-end gap-3 rounded-full p-3 hover:bg-gray-900"
  onclick={props.onclick}
  href={props.href}
>
  <span class="hidden text-2xl text-white md:inline">{props.title}</span>
  {@render props.children()}
</a>

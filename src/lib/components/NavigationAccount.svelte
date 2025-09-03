<script lang="ts">
  import type { NavAccountProps } from '@/lib/components/types';
  import Icon from './Icon.svelte';

  let { displayName, username, imageURL, class: className }: NavAccountProps = $props();
</script>

<div
  class="flex w-fit cursor-pointer items-center justify-end rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full lg:gap-3 {className}"
>
  <img class="h-10 w-10 rounded-full" src={imageURL} alt="profile" />
  <div class="flex flex-col">
    <span class="hidden text-xl text-white lg:inline">{displayName}</span>
    <span class="hidden text-sm text-gray-500 lg:inline">@{username}</span>
  </div>
  <Icon class="hidden lg:ml-10 lg:inline" type="menu"></Icon>
</div>

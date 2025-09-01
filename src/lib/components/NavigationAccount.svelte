<script lang="ts">
  import type { NavAccountProps } from '@/utils/component-types';
  import Icon from './Icon.svelte';

  let props: NavAccountProps = $props();
</script>

<div
  class="flex w-fit cursor-pointer items-center justify-end rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full lg:gap-3"
>
  <img class="h-10 w-10 rounded-full" src={props.imageURL} alt="profile" />
  <div class="flex flex-col">
    <span class="hidden text-xl text-white lg:inline">{props.displayName}</span>
    <span class="hidden text-sm text-gray-500 lg:inline">@{props.username}</span>
  </div>
  <div class="hidden lg:ml-10 lg:inline">
    <Icon type="menu"></Icon>
  </div>
</div>

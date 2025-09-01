<script lang="ts">
  import type { NavAccountProps } from '@/utils/component-types';
  import Icon from './Icon.svelte';

  let props: NavAccountProps = $props();
</script>

<div
  class="flex w-fit cursor-pointer items-center justify-center rounded-full p-3 hover:bg-gray-900 active:bg-gray-900 md:w-full md:gap-3"
>
  <img class="h-12 w-12 rounded-full" src={props.imageURL} alt="profile" />
  <div class="flex flex-col">
    <span class="hidden text-2xl text-white md:inline">{props.displayName}</span>
    <span class="hidden text-base text-gray-500 md:inline">@{props.username}</span>
  </div>
  <div class="align-end hidden md:ms-10 md:inline">
    <Icon type="menu"></Icon>
  </div>
</div>

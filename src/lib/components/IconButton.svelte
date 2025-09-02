<script lang="ts">
  import type { IconButtonProps } from '@/utils/component-types';
  import Icon from './Icon.svelte';

  let {
    icon,
    size = 'md',
    onclick,
    disabled = false,
    class: className,
  }: IconButtonProps = $props();
  let hover = $state<boolean>(false);
</script>

<button
  class="w-fit cursor-pointer rounded-full p-1 {className}"
  {onclick}
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
  {disabled}
>
  <Icon type={icon} color={hover ? 'text-black' : 'text-gray-400'} {size}></Icon>
</button>

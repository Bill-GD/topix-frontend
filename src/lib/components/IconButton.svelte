<script lang="ts">
  import type { IconButtonProps } from '@/lib/components/types';
  import Icon from './Icon.svelte';

  let {
    icon,
    size = 'md',
    onclick,
    disabled = false,
    class: className,
    type,
  }: IconButtonProps = $props();
  let hover = $state<boolean>(false);
</script>

<button
  class="w-fit cursor-pointer rounded-full p-1 {className}"
  {onclick}
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
  {type}
  {disabled}
>
  <Icon type={icon} color={hover ? 'text-gray-400' : 'text-gray-600'} {size}></Icon>
</button>

<script lang="ts">
  import type { IconButtonProps } from '@/lib/components/types';

  let { children, onclick, disabled = false, class: className, type }: IconButtonProps = $props();
  let hover = $state<boolean>(false);
</script>

<button
  class={['main-button', className]}
  {onclick}
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
  {type}
  {disabled}
>
  {@render children()}
</button>

<style lang="postcss">
  @reference '@/app.css';

  .main-button {
    @apply w-fit cursor-pointer rounded-full p-1;
  }
</style>

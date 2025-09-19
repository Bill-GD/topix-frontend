<script lang="ts">
  import type { IconButtonProps } from '$lib/components/types';

  let {
    children,
    onclick,
    disabled = false,
    class: className,
    type,
    round = true,
  }: IconButtonProps = $props();
  let hover = $state<boolean>(false);
</script>

<button
  class={['main-button', round && 'rounded-full', className]}
  onclick={(ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    onclick?.(ev);
  }}
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
    @apply flex w-fit cursor-pointer items-center p-2;
  }
</style>

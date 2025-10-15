<script lang="ts">
  import type { IconButtonProps } from '$lib/components/types';

  let {
    children,
    onclick,
    disabled = false,
    class: className,
    buttonType,
    type,
    round = false,
  }: IconButtonProps = $props();

  const buttonClass = type ? `btn-${type}` : 'hover:bg-zinc-200 dark:hover:bg-zinc-900';
</script>

<button
  class={[
    'w-fit cursor-pointer items-center',
    buttonClass,
    round ? 'rounded-full' : 'rounded-md',
    className,
  ]}
  onclick={onclick
    ? (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        onclick(ev);
      }
    : null}
  type={buttonType}
  {disabled}
>
  {@render children()}
</button>

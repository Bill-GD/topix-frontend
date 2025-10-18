<script lang="ts">
  import type { ButtonType } from '$lib/components/types';
  import type { UnaryVoidFunction } from '$lib/utils/types';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  let {
    children,
    onclick,
    disabled = false,
    class: className,
    buttonType,
    type,
    round = false,
    ...otherProps
  }: {
    children: Snippet;
    onclick?: VoidFunction | UnaryVoidFunction<Event>;
    disabled?: boolean | null;
    buttonType?: 'submit' | 'reset' | 'button' | null;
    type?: ButtonType;
    class?: ClassValue;
    round?: boolean;
  } = $props();

  const buttonClass = type ? `btn-${type}` : 'hover:bg-zinc-200 dark:hover:bg-zinc-700';
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
  {...otherProps}
>
  {@render children()}
</button>

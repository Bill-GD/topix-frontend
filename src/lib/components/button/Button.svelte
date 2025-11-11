<script lang="ts">
  import type { UnaryVoidFunction } from '$lib/utils/types';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import type { ButtonType } from '../types';

  let {
    type,
    outline = false,
    href,
    onclick,
    disabled = false,
    children,
    class: className,
    formaction,
    buttonType,
    round = false,
    ...otherProps
  }: {
    id?: string;
    type?: ButtonType;
    outline?: boolean;
    href?: string;
    formaction?: string;
    onclick?: VoidFunction | UnaryVoidFunction<Event>;
    disabled?: boolean;
    round?: boolean;
    children?: Snippet;
    buttonType?: 'submit' | 'reset' | 'button' | null;
    class?: ClassValue;
  } = $props();

  const buttonClass = type ? `btn-${type}${outline ? '-outline' : ''}` : 'btn';
</script>

{#if href}
  <a
    class={[buttonClass, 'inline-flex no-underline', round && 'rounded-full', className]}
    role="button"
    {href}
    {onclick}
    {...otherProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    class={[buttonClass, 'font-semibold', round && 'rounded-full', className]}
    {formaction}
    {onclick}
    {disabled}
    type={buttonType}
    {...otherProps}
  >
    {@render children?.()}
  </button>
{/if}

<!-- 
@component
A pre-made button component.
@prop `type` One of: `primary`, `danger`, `dark`, `success`. Default is `primary`.
@prop `outline` Toggles outline variant.
@prop `href` Automatically uses `<a>`, redirecting works as normal
@prop `onclick`
@prop `disabled` Disables button if `href` not provided.
-->

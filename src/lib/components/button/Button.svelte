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
    ...otherProps
  }: {
    id?: string;
    type: ButtonType;
    outline?: boolean;
    href?: string;
    formaction?: string;
    onclick?: VoidFunction | UnaryVoidFunction<Event>;
    disabled?: boolean;
    children?: Snippet;
    class?: ClassValue;
  } = $props();

  const buttonClass = `btn-${type}${outline ? '-outline' : ''}`;
  const textColor = buttonClass !== 'btn' && !buttonClass.includes('outline') ? 'text-white' : '';
</script>

{#if href}
  <a
    class={[buttonClass, textColor, 'inline-flex no-underline', className]}
    role="button"
    {href}
    {onclick}
    {...otherProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    class={[buttonClass, textColor, 'font-semibold', className]}
    {formaction}
    {onclick}
    {disabled}
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

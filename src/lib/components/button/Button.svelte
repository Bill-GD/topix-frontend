<script lang="ts">
  import type { ButtonProps } from '$lib/components/types';

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
  }: ButtonProps = $props();

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

<style lang="postcss">
  @reference 'tailwindcss';

  @utility btn {
    @apply cursor-pointer rounded-md px-4 py-2 text-base text-white transition-all duration-100 ease-in-out disabled:cursor-not-allowed disabled:opacity-50;
  }

  @utility outlined {
    @apply bg-transparent outline hover:text-white;
  }

  .btn-dark {
    @apply btn bg-gray-700 hover:bg-gray-600 active:bg-gray-500;
  }

  .btn-primary {
    @apply btn bg-sky-500 hover:bg-sky-600 active:bg-sky-700;
  }

  .btn-danger {
    @apply btn bg-red-500 hover:bg-red-600 active:bg-red-700;
  }

  .btn-success {
    @apply btn bg-green-700 hover:bg-green-800 active:bg-green-900;
  }

  .btn-dark-outline {
    @apply btn outlined text-gray-700 outline-gray-700 hover:bg-gray-700 active:bg-gray-500 active:outline-gray-500;
  }

  .btn-primary-outline {
    @apply btn outlined text-sky-500 outline-sky-500 hover:bg-sky-500 active:bg-sky-700 active:outline-sky-700;
  }

  .btn-danger-outline {
    @apply btn outlined text-red-500 outline-red-500 hover:bg-red-500 active:bg-red-700 active:outline-red-700;
  }

  .btn-success-outline {
    @apply btn outlined text-green-700 outline-green-700 hover:bg-green-700 active:bg-green-900 active:outline-green-900;
  }
</style>

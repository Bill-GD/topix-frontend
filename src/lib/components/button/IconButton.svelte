<script lang="ts">
  import type { IconButtonProps } from '$lib/components/types';

  let {
    children,
    onclick,
    disabled = false,
    class: className,
    type,
    variant,
    outline = false,
    round = true,
  }: IconButtonProps = $props();

  const buttonClass = `btn-${variant}${variant && outline ? '-outline' : ''}`;
</script>

{#if onclick}
  <button
    class={['main-button', buttonClass, round && 'rounded-full', className]}
    onclick={(ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      onclick?.(ev);
    }}
    {type}
    {disabled}
  >
    {@render children()}
  </button>
{:else}
  <button
    class={['main-button', buttonClass, round && 'rounded-full', className]}
    {type}
    {disabled}
  >
    {@render children()}
  </button>
{/if}

<style lang="postcss">
  @reference '@/app.css';

  .main-button {
    @apply flex w-fit cursor-pointer items-center p-2;
  }
</style>

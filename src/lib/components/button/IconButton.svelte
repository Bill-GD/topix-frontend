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

  const buttonClass = type ? `btn-${type}` : 'hover:bg-zinc-300 dark:hover:bg-zinc-900';
</script>

{#if onclick}
  <button
    class={['main-button', buttonClass, round ? 'rounded-full' : 'rounded-md', className]}
    onclick={(ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      onclick?.(ev);
    }}
    type={buttonType}
    {disabled}
  >
    {@render children()}
  </button>
{:else}
  <button
    class={['main-button', buttonClass, round ? 'rounded-full' : 'rounded-md', className]}
    type={buttonType}
    {disabled}
  >
    {@render children()}
  </button>
{/if}

<style lang="postcss">
  @reference '@/app.css';

  .main-button {
    @apply flex w-fit cursor-pointer items-center;
  }
</style>

<script lang="ts">
  import { generateId } from '$lib/utils/helpers';
  import type { ClassValue, HTMLInputTypeAttribute } from 'svelte/elements';
  import IconButton from '../button/IconButton.svelte';
  import Icon from '../misc/Icon.svelte';

  let {
    class: className,
    placeholder = 'Placeholder',
    id = generateId(),
    type,
    required,
    textarea = false,
    clearable = false,
    peekable = false,
    value = $bindable(''),
    name: inputName,
  }: {
    clearable?: boolean;
    peekable?: boolean;
    textarea?: boolean;
    id?: string | null;
    value?: string;
    type?: HTMLInputTypeAttribute | null;
    class?: ClassValue;
    required?: boolean | null;
    name?: string | null;
    placeholder?: string | null;
  } = $props();

  const initType = type;

  let peeking = $state<boolean>(false);
</script>

{#if textarea}
  <textarea
    class={['main-input', className]}
    {id}
    {required}
    {placeholder}
    name={inputName ?? id}
    bind:value
    autocomplete="off"
  ></textarea>
{:else}
  <input
    class={['main-input', className]}
    type={peeking ? 'text' : type}
    {id}
    {required}
    {placeholder}
    name={inputName ?? id}
    bind:value
    autocomplete="off"
  />
{/if}

{#if clearable && value.length > 0}
  <IconButton
    class="absolute top-1/2 p-1 {peekable && initType === 'password'
      ? 'right-8'
      : 'right-1'} -translate-y-1/2"
    buttonType="button"
    round
    onclick={() => (value = '')}
  >
    <Icon
      type="close"
      class="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
      size="sm"
    />
  </IconButton>
{/if}

{#if peekable && initType === 'password'}
  {#key peeking}
    <IconButton
      class="absolute top-1/2 right-1 -translate-y-1/2 p-1"
      buttonType="button"
      round
      onclick={() => (peeking = !peeking)}
    >
      {#if peeking}
        <Icon
          type="eyeSlash"
          class="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
          size="sm"
        />
      {:else}
        <Icon
          type="eye"
          class="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400"
          size="sm"
        />
      {/if}
    </IconButton>
  {/key}
{/if}

<style lang="postcss">
  @reference '@/app.css';

  .main-input {
    @apply w-full rounded-md border border-gray-700 bg-transparent focus:ring-0 focus:outline-2 focus:outline-gray-700;
  }
</style>

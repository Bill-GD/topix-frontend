<script lang="ts">
  import { generateId } from '$lib/utils/helpers';
  import type { Snippet } from 'svelte';
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
    disabled = false,
    readonly = false,
    value = $bindable(''),
    name: inputName,
    prefixIcon,
    list,
  }: {
    clearable?: boolean;
    peekable?: boolean;
    textarea?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    id?: string | null;
    value?: string;
    type?: HTMLInputTypeAttribute | null;
    class?: ClassValue;
    required?: boolean | null;
    name?: string | null;
    placeholder?: string | null;
    prefixIcon?: Snippet;
    list?: string;
  } = $props();

  const initType = type;

  let peeking = $state<boolean>(false);
</script>

{#if prefixIcon && !textarea}
  <div class="absolute top-1/2 left-2 -translate-y-1/2 p-1">
    {@render prefixIcon()}
  </div>
{/if}

{#if textarea}
  <textarea
    class={['main-input', className]}
    {id}
    {required}
    {placeholder}
    name={inputName ?? id}
    bind:value
    autocomplete="off"
    {disabled}
    {readonly}
  ></textarea>
{:else}
  <input
    class={['main-input', prefixIcon && 'pl-10', className]}
    type={peeking ? 'text' : type}
    {id}
    {required}
    {placeholder}
    name={inputName ?? id}
    bind:value
    autocomplete="off"
    {list}
    {disabled}
    {readonly}
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

<!--
@component
The input component.

To have `clearable`, `peekable` icons & `prefixIcon` rendered correctly, wrap
the input in a relative positioned element.
-->

<style lang="postcss">
  @reference '@/app.css';

  .main-input {
    @apply w-full rounded-md border border-gray-700 bg-transparent focus:ring-0 focus:outline-2 focus:outline-gray-700;
  }
</style>

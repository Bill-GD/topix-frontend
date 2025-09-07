<script lang="ts">
  import type { InputProps } from '@/lib/components/types';
  import { generateId } from '@/lib/utils/helpers';
  import IconButton from './IconButton.svelte';

  let {
    class: className,
    placeholder = 'Placeholder',
    id = generateId(),
    type,
    required,
    clearable = false,
    peekable = false,
    value = $bindable(''),
    name: inputName,
  }: InputProps = $props();

  const initType = type;

  let peeking = $state<boolean>(false);
</script>

<input
  class={className}
  type={peeking ? 'text' : type}
  {id}
  {required}
  {placeholder}
  name={inputName ?? id}
  bind:value
  autocomplete="off"
/>

{#if clearable && value.length > 0}
  <IconButton
    class="absolute top-1/2 {peekable && initType === 'password'
      ? 'right-8'
      : 'right-1'} -translate-y-1/2"
    icon="close"
    size="sm"
    type="button"
    onclick={() => (value = '')}
  ></IconButton>
{/if}

{#if peekable && initType === 'password'}
  {#key peeking}
    <IconButton
      class="absolute top-1/2 right-1 -translate-y-1/2"
      icon={peeking ? 'eyeSlash' : 'eye'}
      size="sm"
      type="button"
      onclick={() => (peeking = !peeking)}
    ></IconButton>
  {/key}
{/if}

<style lang="postcss">
  @reference "@/app.css";

  input {
    @apply w-full rounded-md border border-gray-700 bg-transparent focus:ring-0 focus:outline-2 focus:outline-gray-700;
  }
</style>

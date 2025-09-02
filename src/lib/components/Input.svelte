<script lang="ts">
  import type { InputProps } from '@/utils/component-types';
  import { generateId } from '@/utils/helpers';
  import IconButton from './IconButton.svelte';

  let {
    class: className,
    placeholder = 'Placeholder',
    id = generateId(),
    type,
    required,
    clearable = false,
    value = $bindable(''),
  }: InputProps = $props();
</script>

<input
  class="w-full rounded-md border border-gray-700 bg-transparent focus:ring-0 focus:outline-2 focus:outline-gray-700 {className}"
  {type}
  {id}
  {required}
  bind:value
  autocomplete="off"
  {placeholder}
/>

{#if clearable && value.length > 0}
  <IconButton
    class="absolute top-1/2 right-1 -translate-y-1/2"
    icon="close"
    size="sm"
    onclick={() => (value = '')}
  ></IconButton>
{/if}

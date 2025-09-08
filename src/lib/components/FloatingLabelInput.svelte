<script lang="ts">
  import type { FloatingLabelInputProps } from '@/lib/components/types';
  import Input from './Input.svelte';

  let {
    children,
    clearable = false,
    peekable = false,
    type,
    class: className,
    name: inputName,
    required = false,
    value = '',
  }: FloatingLabelInputProps = $props();

  const id = $props.id();
</script>

<div class={['relative w-fit', className]}>
  <Input
    class="peer block"
    {id}
    {type}
    {clearable}
    {peekable}
    name={inputName}
    bind:value
    placeholder=" "
    {required}
  />
  <label class={['default', value.length > 0 ? 'input-not-focus' : '']} for={id}>
    {@render children()}
  </label>
</div>

<style lang="postcss">
  @reference '@/app.css';

  .default {
    @apply absolute left-3 z-2 truncate bg-gray-950 text-left text-gray-500 duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:left-1 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:px-2;
  }

  .input-not-focus {
    @apply not-peer-focus:top-2 not-peer-focus:left-1 not-peer-focus:-translate-y-5 not-peer-focus:scale-90 not-peer-focus:px-2;
  }
</style>

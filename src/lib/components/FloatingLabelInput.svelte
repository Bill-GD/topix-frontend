<script lang="ts">
  import type { FloatingLabelInputProps } from '@/utils/component-types';
  import Input from './Input.svelte';

  let { children, clearable = false, type, class: className }: FloatingLabelInputProps = $props();
  const id = $props.id();
</script>

<div class="relative w-fit {className}">
  <Input class="peer block" {id} {type} {clearable} placeholder=" " required />
  <label
    class="absolute left-3 z-2 truncate bg-gray-950 text-left text-gray-500 duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:left-1 peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:px-2"
    for={id}
  >
    {@render children()}
  </label>
</div>

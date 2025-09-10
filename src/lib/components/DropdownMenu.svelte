<script lang="ts">
  import type { DropdownMenuProps } from './types';

  let { class: className, children }: DropdownMenuProps = $props();
</script>

<div
  class={[
    'fixed z-10 divide-y divide-gray-400 rounded-lg bg-gray-800 transition-all duration-300',
    className,
  ]}
>
  <ul class="py-2 text-white">
    {@render children()}
  </ul>
</div>

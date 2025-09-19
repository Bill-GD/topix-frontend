<script lang="ts">
  import type { DropdownItemProps } from './types';

  let {
    href,
    children,
    rel,
    noHover = false,
    onclick,
    class: className,
  }: DropdownItemProps = $props();
</script>

<li>
  <a class={['block px-4 py-2', !noHover && 'hover:bg-gray-700', className]} {href} {rel} {onclick}>
    {@render children()}
  </a>
</li>

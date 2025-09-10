<script lang="ts">
  import type { DropdownItemProps } from './types';

  let { href, children, rel }: DropdownItemProps = $props();
</script>

<li>
  <a {href} data-sveltekit-preload-data="tap" {rel} class="block px-4 py-2 hover:bg-gray-700">
    {@render children()}
  </a>
</li>

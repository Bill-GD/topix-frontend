<script lang="ts">
  import type { DropdownItemProps } from './types';

  let { href, children }: DropdownItemProps = $props();
</script>

<li>
  <a {href} data-sveltekit-preload-data="tap" class="block px-4 py-2 hover:bg-gray-700">
    {@render children()}
  </a>
</li>

<script lang="ts">
  import { onMount } from 'svelte';
  import type { DropdownMenuProps } from '$lib/components/types';

  let {
    class: className,
    children,
    trigger,
    horizontal = false,
    align,
    position,
    origin,
  }: DropdownMenuProps = $props();
  let showMenu = $state<boolean>(false);
  const id = $props.id();
  const originClasses = {
    t: 'origin-top',
    tr: 'origin-top-right',
    r: 'origin-right',
    br: 'origin-bottom-right',
    b: 'origin-bottom',
    bl: 'origin-bottom-left',
    l: 'origin-left',
    tl: 'origin-top-left',
  };

  onMount(() => {
    const trigger = document.getElementById(`trigger-${id}`) as HTMLElement;
    const menu = document.getElementById(`dropdown-menu-${id}`) as HTMLElement;

    function toggleMenu() {
      if (showMenu) return;
      showMenu = true;
      const rect = trigger.getBoundingClientRect();

      menu.style.minWidth = `${rect.width}px`;
      switch (position) {
        case 'top':
          menu.style.top = `${rect.top - menu.offsetHeight}px`;
          break;
        case 'bottom':
          menu.style.top = `${rect.bottom}px`;
          break;
      }
      switch (align) {
        case 'start':
          menu.style.left = `${rect.left}px`;
          break;
        case 'end':
          menu.style.left = `${rect.left - (menu.offsetWidth - rect.width)}px`;
          break;
      }
    }

    trigger.addEventListener('click', toggleMenu);

    return () => trigger.removeEventListener('click', toggleMenu);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={className}
  onmouseleave={() => {
    showMenu = false;
  }}
>
  <div id="trigger-{id}">
    {@render trigger()}
  </div>

  <div
    class={[
      'dropdown-menu',
      'fixed z-10 rounded-lg bg-gray-800 transition-all',
      originClasses[origin],
      showMenu ? 'scale-100 opacity-100 duration-150' : 'scale-50 opacity-0 duration-250',
    ]}
    id="dropdown-menu-{id}"
  >
    <ul class={['py-2 text-white', horizontal && 'flex']}>
      {@render children()}
    </ul>
  </div>
</div>

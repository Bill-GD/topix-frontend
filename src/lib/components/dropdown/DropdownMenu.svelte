<script lang="ts">
  import type { DropdownMenuProps } from '$lib/components/types';
  import { tick } from 'svelte';
  import { scale } from 'svelte/transition';

  let {
    class: className,
    children,
    trigger,
    horizontal = false,
    align,
    position,
  }: DropdownMenuProps = $props();

  const id = $props.id();
  let showMenu = $state<boolean>(false);

  function toggleMenu() {
    showMenu = !showMenu;
  }

  async function menuPosition() {
    await tick();
    if (showMenu) {
      const trigger = document.getElementById(`trigger-${id}`) as HTMLElement;
      const menu = document.getElementById(`dropdown-menu-${id}`) as HTMLElement;
      const triggerRect = trigger.getBoundingClientRect();

      menu.style.minWidth = `${triggerRect.width}px`;
      menu.style[position] = `-${menu.offsetHeight}px`;
      menu.style[align] = `0px`;
    }
  }

  $effect(() => {
    showMenu;
    menuPosition();
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={[className]}
  onmouseleave={() => {
    showMenu = false;
  }}
>
  <div class="relative">
    {#if showMenu}
      <div
        class={[
          'dropdown-menu',
          'absolute z-[5] rounded-lg bg-zinc-50 box-drop-shadow transition-all dark:bg-zinc-800',
          showMenu ? 'scale-100 opacity-100 duration-100' : 'scale-50 opacity-0 duration-200',
        ]}
        id="dropdown-menu-{id}"
        in:scale={{ start: 0.75, duration: 100 }}
        out:scale={{ start: 1, duration: 200 }}
      >
        <ul class={['p-1 dark:text-white', horizontal && 'flex']}>
          {@render children()}
        </ul>
      </div>
    {/if}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div id="trigger-{id}" onclick={toggleMenu}>
      {@render trigger()}
    </div>
  </div>
</div>

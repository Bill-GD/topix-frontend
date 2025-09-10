<script lang="ts">
  import { DropdownItem, DropdownMenu, Icon, NavigationItem } from '@/lib/components';
  import { Icons, type HomeLayoutProps } from '@/lib/components/types';
  import { onMount } from 'svelte';

  let { children, right, self }: HomeLayoutProps = $props();

  const navItems: {
    title: string;
    href: string;
    icon: keyof typeof Icons;
  }[] = [
    { title: 'Home', href: '/', icon: 'home' },
    { title: 'Search', href: '/search', icon: 'search' },
    { title: 'Chat', href: '/chat', icon: 'message' },
    { title: 'Groups', href: '/groups', icon: 'group' },
  ];

  let showMenu = $state<boolean>(false);
  let hover = $state<boolean>(false);

  onMount(() => {
    const acc = document.getElementsByClassName('account-item')[0] as HTMLElement;
    const menu = document.getElementsByClassName('dropdown-menu')[0] as HTMLElement;

    function showMenu() {
      const rect = acc.getBoundingClientRect();
      menu.style.minWidth = `${rect.width}px`;
      menu.classList.toggle('hidden');
      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.top - menu.offsetHeight}px`;
    }

    acc.addEventListener('click', showMenu);

    return () => acc.removeEventListener('click', showMenu);
  });
</script>

<main>
  <nav>
    <span class="nav-title">topix</span>

    {#each navItems as item}
      <NavigationItem title={item.title} href={item.href}>
        <Icon type={item.icon} />
      </NavigationItem>
    {/each}

    <div
      class="mt-auto ml-auto"
      role="button"
      tabindex="0"
      onmouseenter={() => (hover = true)}
      onmouseleave={() => {
        hover = false;
        showMenu = false;
      }}
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="account-item"
        role="button"
        tabindex="0"
        onclick={() => {
          if (hover) showMenu = !showMenu;
        }}
      >
        <div class="flex flex-col">
          <span class="hidden text-xl text-white md:inline">{self.displayName}</span>
          <span class="hidden text-sm text-gray-500 md:inline">@{self.username}</span>
        </div>

        <img
          class="h-10 w-10 rounded-full"
          src={self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />

        <DropdownMenu class={[(!hover || !showMenu) && 'hidden', 'dropdown-menu']}>
          <DropdownItem href="/user/{self.username}">Profile</DropdownItem>
          <DropdownItem href="/settings/account">Settings</DropdownItem>
          <DropdownItem href="/logout">Log out</DropdownItem>
        </DropdownMenu>
      </div>
    </div>
  </nav>

  <div class="main-content">
    {@render children?.()}
  </div>

  <aside>
    {@render right?.()}
  </aside>
</main>

<style lang="postcss">
  @reference "@/app.css";

  main {
    @apply flex h-dvh items-center justify-between bg-gray-950 text-white;
  }

  nav {
    @apply flex h-dvh flex-col items-center gap-4 border-r border-r-gray-700 px-1 py-3 md:w-1/4 md:px-3;
  }

  .nav-title {
    @apply hidden w-full p-2 text-end text-2xl md:inline;
  }

  .account-item {
    @apply flex w-fit cursor-pointer items-center justify-end rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 md:w-full md:gap-4 md:px-4;
  }

  .main-content {
    @apply flex h-dvh flex-auto flex-col justify-start;
  }

  aside {
    @apply hidden h-dvh p-3 md:block md:w-1/4;
  }
</style>

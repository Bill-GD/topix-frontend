<script lang="ts">
  import type { LayoutProps } from '../$types';
  import { Icon, NavigationItem } from '@/lib/components';
  import { Icons } from '@/lib/components/types';
  import type { User } from '@/lib/utils/types';

  let { children, data }: LayoutProps = $props();

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
  const self = data.self as User;

  let showMenu = $state<boolean>(false);
  let hover = $state<boolean>(false);
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
      class="mt-auto"
      role="button"
      tabindex="0"
      onmouseenter={() => (hover = true)}
      onmouseleave={() => {
        hover = false;
        showMenu = false;
      }}
    >
      <div
        class={[
          (!hover || !showMenu) && 'hidden',
          'z-10 w-full divide-y divide-gray-400 rounded-lg bg-gray-800 transition-all duration-300',
        ]}
      >
        <ul class="py-2 text-white">
          <li>
            <a href="/user/{self.username}" class="block px-4 py-2 hover:bg-gray-700">Profile</a>
          </li>
          <li>
            <a href="/logout" class="block px-4 py-2 hover:bg-gray-700">Log out</a>
          </li>
        </ul>
      </div>

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="flex w-fit cursor-pointer items-center justify-end rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full lg:gap-3"
        role="button"
        tabindex="0"
        onclick={() => {
          if (hover) showMenu = !showMenu;
        }}
      >
        <img
          class="h-10 w-10 rounded-full"
          src={self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col">
          <span class="hidden text-xl text-white lg:inline">{self.displayName}</span>
          <span class="hidden text-sm text-gray-500 lg:inline">@{self.username}</span>
        </div>
        <Icon class="hidden lg:ml-10 lg:inline" type="menu"></Icon>
      </div>
    </div>
  </nav>

  <div class="main-content">
    {@render children?.()}
  </div>

  <aside></aside>
</main>

<style lang="postcss">
  @reference "@/app.css";

  main {
    @apply flex h-dvh items-center justify-between bg-gray-950 text-white;
  }

  .nav-title {
    @apply hidden w-full p-2 text-end text-2xl lg:inline;
  }

  nav {
    @apply flex h-dvh w-fit flex-col items-center gap-4 border-r border-gray-700 px-1 py-3 lg:px-3;
  }

  .main-content {
    @apply flex h-dvh flex-auto flex-col justify-start;
  }

  aside {
    @apply hidden h-dvh p-3 md:block md:w-1/3 lg:w-1/4;
  }
</style>

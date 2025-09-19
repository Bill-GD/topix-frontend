<script lang="ts">
  import { Icons, type HomeLayoutProps } from '$lib/components/types';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { NavigationItem } from '$lib/components/link';
  import { Icon } from '$lib/components/misc';

  let { self, children, right }: HomeLayoutProps = $props();

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
</script>

<main>
  <header>
    <span class="header-title">topix</span>

    {#each navItems as item}
      <NavigationItem class="ml-auto" title={item.title} href={item.href}>
        <Icon type={item.icon} />
      </NavigationItem>
    {/each}

    <DropdownMenu class="mt-auto ml-auto" position="top" align="start" origin="b">
      {#snippet trigger()}
        <div class="account-item">
          <div class="flex flex-col text-right">
            <span class="hidden text-xl text-white lg:inline">{self.displayName}</span>
            <span class="hidden text-sm text-gray-500 lg:inline">@{self.username}</span>
          </div>

          <img
            class="profile-picture-sm"
            src={self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
            alt="profile"
          />
        </div>
      {/snippet}

      <DropdownItem href="/user/{self.username}">Profile</DropdownItem>
      <DropdownItem href="/settings/account">Settings</DropdownItem>
      <DropdownItem class="text-red-500" href="/logout" rel="external">Log out</DropdownItem>
    </DropdownMenu>
  </header>

  <section class="main-content">
    {@render children?.()}
  </section>

  <aside>
    {@render right?.()}
  </aside>
</main>

<style lang="postcss">
  @reference "@/app.css";

  main {
    @apply flex h-dvh items-center justify-between bg-gray-950 text-white;
  }

  header {
    @apply flex h-dvh min-w-fit flex-col items-center gap-4 border-r border-r-gray-700 px-1 py-3 lg:w-full lg:px-3;
  }

  .header-title {
    @apply hidden w-full p-2 text-end text-2xl lg:inline;
  }

  .account-item {
    @apply flex w-fit cursor-pointer items-center justify-end rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full lg:gap-4 lg:px-4;
  }

  .main-content {
    @apply flex h-full flex-auto flex-col justify-start overflow-y-auto md:max-w-xl md:min-w-xl lg:max-w-2xl lg:min-w-2xl;
  }

  .main-content::-webkit-scrollbar {
    display: none;
  }

  aside {
    @apply hidden h-dvh border-l border-gray-700 p-3 md:block md:w-full;
  }
</style>

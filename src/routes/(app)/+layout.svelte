<script lang="ts">
  import type { LayoutProps } from '../$types';
  import { Icon, NavigationAccount, NavigationItem } from '@/lib/components';
  import { Icons } from '@/lib/components/types';

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
</script>

<main class="flex h-dvh items-center justify-between bg-gray-950 text-white">
  <nav
    class="flex h-dvh w-fit flex-col items-center gap-4 border-r border-gray-700 px-1 py-3 lg:px-3"
  >
    <div class="hidden w-full p-2 text-end text-2xl lg:inline">topix</div>

    {#each navItems as item}
      <NavigationItem title={item.title} href={item.href}>
        <Icon type={item.icon} />
      </NavigationItem>
    {/each}

    <NavigationAccount
      class="mt-auto"
      displayName="Username"
      username="user123"
      imageURL="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    ></NavigationAccount>
  </nav>

  <div class="flex h-dvh flex-auto flex-col justify-start">
    {@render children?.()}
  </div>

  <aside class="hidden h-dvh p-3 md:block md:w-1/3 lg:w-1/4"></aside>
</main>

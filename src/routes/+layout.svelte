<script lang="ts">
  import { Icon, NavigationAccount, NavigationItem } from '@/lib/components';
  import { setContext } from 'svelte';
  import 'tippy.js/dist/tippy.css';
  import '../app.css';
  import type { LayoutProps } from './$types';
  import type { NavItem } from '@/utils/types';
  import { PUBLIC_API_PORT, PUBLIC_API_SERVER } from '$env/static/public';

  setContext('API_URL', `${PUBLIC_API_SERVER}:${PUBLIC_API_PORT}`);

  let { children, data }: LayoutProps = $props();

  const navItems: NavItem[] = [
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

  <aside class="hidden h-dvh w-1/4 p-3 lg:block"></aside>
</main>

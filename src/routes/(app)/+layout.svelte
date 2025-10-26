<script lang="ts">
  import { IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { Switch } from '$lib/components/input';
  import { NavigationItem } from '$lib/components/link';
  import { Badge, Icon } from '$lib/components/misc';
  import type { Icons } from '$lib/components/types';
  import { getTheme } from '$lib/utils/theme.svelte';
  import { fade, slide } from 'svelte/transition';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();

  const navItems: {
    title: string;
    href: string;
    icon: keyof typeof Icons;
  }[] = [
    { title: 'Home', href: '/home', icon: 'home' },
    { title: 'Search', href: '/search', icon: 'search' },
    { title: 'Chat', href: '/chat', icon: 'message' },
    { title: 'Groups', href: '/groups', icon: 'group' },
  ];

  const theme = getTheme();
  let showNav = $state<boolean>(false);
</script>

{#snippet sidebar()}
  {#each navItems as item}
    <NavigationItem title={item.title} href={item.href}>
      <Icon type={item.icon} />
    </NavigationItem>
  {/each}

  <NavigationItem title="Notifications" href="/notifications">
    <div class="relative">
      <Icon type="bell" />
      {#if data.notificationCount > 0}
        <Badge
          class="absolute -top-2 -right-3"
          text={data.notificationCount > 99 ? '99+' : `${data.notificationCount}`}
        />
      {/if}
    </div>
  </NavigationItem>

  {#if data.self.role === 'admin'}
    <NavigationItem title="Users" href="/users">
      <Icon type="user" />
    </NavigationItem>
  {/if}
{/snippet}

<main class="min-h-screen">
  <header
    class="fixed top-0 z-4 flex h-(--header-height) w-full items-center bg-zinc-50 px-2 box-shadow md:px-4 dark:border-b dark:border-zinc-700 dark:bg-zinc-900"
  >
    <IconButton
      class="relative mr-2 inline p-2 lg:hidden"
      onclick={() => (showNav = !showNav)}
      round
    >
      <Icon type="bar" />
      {#if data.notificationCount > 0}
        <Badge
          class="absolute -top-1 -right-2"
          text={data.notificationCount > 99 ? '99+' : `${data.notificationCount}`}
        />
      {/if}
    </IconButton>
    <span class="text-3xl">
      <img class="aspect-square h-10 w-10" src="/favicon.svg" alt="logo" />
    </span>

    <DropdownMenu class="ml-auto" position="bottom" align="right">
      {#snippet trigger()}
        <img
          class="profile-picture-sm cursor-pointer hover:bg-zinc-700/60"
          src={data.self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
      {/snippet}

      <DropdownItem class="flex items-center gap-3" href="/user/{data.self.username}">
        <img
          class="profile-picture-sm"
          src={data.self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col">
          <span>View profile</span>
          <div class="flex items-center gap-2 text-sm">
            <span class="dark:text-white">{data.self.displayName}</span>
            <span class="text-gray-500">@{data.self.username}</span>
          </div>
        </div>
      </DropdownItem>
      <DropdownItem href="/settings">Settings</DropdownItem>
      <DropdownItem class="flex items-center justify-between" onclick={() => theme.toggle()}>
        Dark mode
        <Switch class="w-1/3" checked={theme.isDark} onchange={() => theme.toggle()} />
      </DropdownItem>
      <DropdownItem class="text-red-500" href="/logout" rel="external">Log out</DropdownItem>
    </DropdownMenu>
  </header>

  <div class="relative flex gap-4 pt-(--header-height)">
    <aside class="sticky top-0 hidden h-full flex-col items-center gap-4 p-3 lg:flex">
      {@render sidebar()}
    </aside>

    {#if showNav}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="fixed inset-0 z-6 bg-zinc-900/40"
        onclick={() => (showNav = false)}
        transition:fade={{ duration: 200 }}
      ></div>
      <aside
        class="fixed top-0 left-0 z-7 flex h-screen w-80 flex-col flex-nowrap items-center gap-4 rounded-r-lg border-r border-zinc-400 bg-zinc-200 p-3 box-shadow dark:border-zinc-700 dark:bg-zinc-950"
        transition:slide={{ duration: 200, axis: 'x' }}
      >
        {@render sidebar()}
      </aside>
    {/if}

    <section class="mx-4 flex w-full flex-col md:mx-8">
      <div class="md:w-3/4 md:self-center xl:w-2/3 2xl:w-1/2">
        {@render children?.()}
      </div>
    </section>
  </div>
</main>

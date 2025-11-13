<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { Switch } from '$lib/components/input';
  import { NavigationItem } from '$lib/components/link';
  import { Badge, Icon } from '$lib/components/misc';
  import { getToaster } from '$lib/components/toast';
  import type { Icons } from '$lib/components/types';
  import { formatNotification, getApiUrl } from '$lib/utils/helpers';
  import { getTheme } from '$lib/utils/theme.svelte';
  import type { Notification } from '$lib/utils/types';
  import { onMount } from 'svelte';
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
    { title: 'Users', href: '/users', icon: 'user' },
  ];

  const theme = getTheme();
  const toaster = getToaster();
  let notificationSource: EventSource;
  let showNav = $state<boolean>(false);

  onMount(() => {
    notificationSource = new EventSource(`${getApiUrl()}/notification/sse`);

    notificationSource.onmessage = ({ data: msgData }) => {
      const noti = formatNotification(JSON.parse(msgData) as Notification);
      if (noti.receiverId !== data.self.id) return;
      toaster.addToast(
        `<b>${noti.actor.displayName}</b>` +
          (noti.actorCount > 1 ? ` and ${noti.actorCount - 1} other` : '') +
          ` ${noti.action}` +
          (noti.actionType === 'react'
            ? noti.postContent
              ? `: "${noti.postContent}"`
              : '.'
            : noti.actionType === 'update_thread'
              ? `: "${noti.threadTitle}"`
              : ''),
        'info',
      );
    };

    return notificationSource.close;
  });
</script>

{#snippet navbar(inHeader: boolean = false)}
  {#each navItems as item}
    {#if item.href.includes('/users') && data.self.role !== 'admin'}{:else}
      <NavigationItem
        title={item.title}
        href={item.href}
        isCurrent={page.url.pathname === item.href}
        {inHeader}
      >
        <Icon type={item.icon} />
      </NavigationItem>
    {/if}
  {/each}
{/snippet}

<main class="relative min-h-screen bg-zinc-100 dark:bg-zinc-950">
  <header
    class="sticky top-0 z-4 flex w-full items-center bg-zinc-100 p-2 box-shadow md:px-4 dark:border-b dark:border-zinc-700 dark:bg-zinc-900"
  >
    <Button class="relative mr-2 inline p-2 md:hidden" onclick={() => (showNav = !showNav)}>
      <Icon type="bar" />
      {#if data.notificationCount > 0}
        <Badge
          class="absolute -top-1 -right-2"
          text={data.notificationCount > 99 ? '99+' : `${data.notificationCount}`}
        />
      {/if}
    </Button>
    <span class="text-3xl">
      <img class="aspect-square h-8 w-8" src="/favicon.svg" alt="logo" />
    </span>

    <!-- <div class="ml-auto items-center gap-4 sm:flex"> -->
    <div
      class="center-width absolute top-1/2 left-1/2 hidden w-full -translate-1/2 justify-between gap-4 md:flex"
    >
      {@render navbar(true)}
    </div>

    <div class="ml-auto flex items-center gap-4">
      <NavigationItem
        class="p-2"
        title="Notifications"
        href="/notifications"
        isCurrent={page.url.pathname === '/notifications'}
        inHeader
        noPadding
      >
        <Icon type="bell" />
        {#if data.notificationCount > 0}
          <Badge
            class="absolute -top-2 -right-3"
            text={data.notificationCount > 99 ? '99+' : `${data.notificationCount}`}
          />
        {/if}
      </NavigationItem>

      <DropdownMenu position="bottom" align="right">
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
        <DropdownItem class="font-semibold text-red-500" href="/logout" rel="external">
          Log out
        </DropdownItem>
      </DropdownMenu>
    </div>
  </header>

  {#if showNav}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 z-6 bg-zinc-200/80 dark:bg-zinc-900/40"
      onclick={() => (showNav = false)}
      transition:fade={{ duration: 200 }}
    ></div>
    <aside
      class="fixed top-0 left-0 z-7 flex h-screen w-80 flex-col flex-nowrap items-center gap-4 rounded-r-lg bg-zinc-100 p-3 box-shadow dark:border-r dark:border-zinc-700 dark:bg-zinc-900"
      transition:slide={{ duration: 200, axis: 'x' }}
    >
      {@render navbar()}
    </aside>
  {/if}

  <div class="center-width mx-auto px-4 pb-4 md:px-0">
    {@render children?.()}
  </div>
</main>

<style lang="postcss">
  @reference '@/app.css';

  .center-width {
    @apply md:w-2/3 lg:w-1/2 2xl:w-1/3;
  }
</style>

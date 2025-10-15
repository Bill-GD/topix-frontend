<script lang="ts">
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { NavigationItem } from '$lib/components/link';
  import { Icon } from '$lib/components/misc';
  import { Icons, type HomeLayoutProps } from '$lib/components/types';
  import { fade, slide } from 'svelte/transition';
  import IconButton from '../button/IconButton.svelte';

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

  let showNav = $state<boolean>(false);
</script>

{#snippet sidebar()}
  {#each navItems as item}
    <NavigationItem title={item.title} href={item.href}>
      <Icon type={item.icon} />
    </NavigationItem>
  {/each}

  {#if self.role === 'admin'}
    <NavigationItem title="Users" href="/users">
      <Icon type="user" />
    </NavigationItem>
  {/if}
{/snippet}

<main class="min-h-screen bg-zinc-200 pb-16 md:pb-0 dark:bg-zinc-950 dark:text-white">
  <header
    class="fixed top-0 z-[4] flex h-(--header-height) w-full items-center bg-zinc-50 px-2 box-drop-shadow md:px-4"
  >
    <IconButton class="mr-2 inline p-2 lg:hidden" onclick={() => (showNav = !showNav)} round>
      <Icon type="bar" />
    </IconButton>
    <span class="text-3xl">
      <img class="aspect-square h-8 w-8" src="/favicon.svg" alt="logo" />
    </span>

    <DropdownMenu class="ml-auto" position="bottom" align="right">
      {#snippet trigger()}
        <!-- <div
          class="w-full cursor-pointer items-center rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-900"
        > -->
        <img
          class="profile-picture-sm"
          src={self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />

        <!-- <div class="hidden flex-col text-right lg:flex">
          </div> -->
        <!-- </div> -->
      {/snippet}

      <DropdownItem class="flex items-center gap-3" href="/user/{self.username}">
        <img
          class="profile-picture-sm"
          src={self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col">
          <span>View profile</span>
          <div class="flex items-center gap-2 text-sm">
            <span class="dark:text-white">{self.displayName}</span>
            <span class="text-gray-500">@{self.username}</span>
          </div>
        </div>
      </DropdownItem>
      <DropdownItem href="/settings/account">Settings</DropdownItem>
      <DropdownItem class="text-red-500" href="/logout" rel="external">Log out</DropdownItem>
    </DropdownMenu>
  </header>

  <div class="mt-(--header-height) flex gap-4">
    <aside
      class="sticky top-(--header-height) hidden h-dvh w-full max-w-1/4 flex-col items-center gap-4 p-3 px-1 lg:flex"
    >
      {@render sidebar()}
    </aside>

    {#if showNav}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="fixed inset-0 z-[5] bg-zinc-900/40"
        onclick={() => (showNav = false)}
        transition:fade={{ duration: 200 }}
      ></div>
      <aside
        class="fixed top-0 left-0 z-30 flex h-screen w-80 flex-col flex-nowrap items-center gap-4 rounded-r-lg border-gray-400 bg-zinc-200 p-3 box-drop-shadow dark:border-gray-700 dark:bg-zinc-950"
        transition:slide={{ duration: 200, axis: 'x' }}
      >
        {@render sidebar()}
      </aside>
    {/if}

    <section class="mx-2 flex w-full flex-col md:mx-8 lg:mx-0 lg:w-[734px]">
      {@render children?.()}
    </section>

    <aside class="sticky top-(--header-height) hidden h-dvh max-w-1/4 p-3 lg:block">
      {@render right?.()}
    </aside>
  </div>
</main>

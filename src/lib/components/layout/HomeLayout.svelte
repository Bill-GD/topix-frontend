<script lang="ts">
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { NavigationItem } from '$lib/components/link';
  import { Icon } from '$lib/components/misc';
  import { Icons, type HomeLayoutProps } from '$lib/components/types';
  import { onMount } from 'svelte';
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
  let dropdownAlign = $state<'left' | 'right'>('left');

  function updateDropdownAlign() {
    dropdownAlign = window.matchMedia('(min-width: 768px)').matches ? 'left' : 'right';
  }

  onMount(() => {
    updateDropdownAlign();
    window.addEventListener('resize', updateDropdownAlign);
    return () => window.removeEventListener('resize', updateDropdownAlign);
  });
</script>

{#snippet navbar()}
  {#each navItems as item}
    <NavigationItem class="md:ml-auto" title={item.title} href={item.href}>
      <Icon type={item.icon} />
    </NavigationItem>
  {/each}

  {#if self.role === 'admin'}
    <NavigationItem class="md:ml-auto" title="Users" href="/users">
      <Icon type="user" />
    </NavigationItem>
  {/if}

  <DropdownMenu class="md:mt-auto md:ml-auto" position="top" align={dropdownAlign}>
    {#snippet trigger()}
      <div
        class="flex w-fit cursor-pointer items-center justify-end rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full lg:gap-4 lg:px-4"
      >
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
{/snippet}

<main class="flex min-h-screen bg-gray-950 pb-16 text-white md:pb-0">
  <header
    class="sticky top-0 hidden h-dvh min-w-fit flex-col items-center gap-4 border-r border-r-gray-700 px-1 py-3 md:flex lg:w-full lg:px-3"
  >
    <span class="hidden w-full p-2 text-end text-2xl lg:inline">topix</span>
    {@render navbar()}
  </header>

  <section class="flex w-full flex-col md:min-w-[512px] lg:min-w-[672px]">
    {@render children?.()}
  </section>

  <aside class="sticky top-0 hidden h-dvh border-l border-gray-700 p-3 md:block md:w-full">
    {@render right?.()}
  </aside>

  {#if showNav}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 z-[20] bg-gray-900/40"
      onclick={() => (showNav = false)}
      transition:fade={{ duration: 200 }}
    ></div>
    <aside
      class="fixed top-0 right-0 z-30 h-screen w-80 flex-nowrap rounded-l-md border-l border-gray-700 bg-gray-950 p-3 md:hidden"
      transition:slide={{ duration: 200, axis: 'x' }}
    >
      {#if right}
        {@render right()}
      {:else}
        <p class="text-center font-semibold">Nothing to see here.</p>
      {/if}
    </aside>
  {/if}

  <nav
    class="fixed bottom-0 z-10 flex h-fit w-full items-center justify-around border-t border-gray-700 bg-gray-950 py-1 md:hidden"
  >
    {@render navbar()}
    <IconButton onclick={() => (showNav = !showNav)}>
      <Icon type="bar" />
    </IconButton>
  </nav>
</main>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button, IconButton } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'delete' | null>(null);
  let username = $state<string>('');
  let pageIndex = 1;
  let disableScroller = $state<boolean>(data.endOfList);
  let users = $derived(data.users);
  let searchString = $derived<string>(decodeURIComponent(page.url.searchParams.get('q') ?? ''));
  let searched = $derived<boolean>(page.url.searchParams.has('q'));

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Users - topix</title>
</svelte:head>

<ReturnHeader>Users</ReturnHeader>

<div class="flex flex-col gap-4">
  <form
    class="relative"
    method="post"
    onsubmit={(ev) => {
      ev.preventDefault();
      goto(`?q=${encodeURIComponent(searchString)}`, { replaceState: true });
    }}
  >
    <Input
      name="search-string"
      bind:value={searchString}
      clearable
      placeholder="Search by username or display name"
    >
      {#snippet prefixIcon()}
        <Icon class="text-zinc-500" type="search" size="sm" />
      {/snippet}
    </Input>
  </form>

  {#if searched}
    <Button
      class="mr-auto"
      type="dark"
      outline
      onclick={() => {
        goto(`/users`, { replaceState: true });
      }}
    >
      Clear result
    </Button>
  {/if}

  {#if searched && users.length <= 0}
    <p class="p-4 text-center text-xl font-semibold">No result found.</p>
  {:else}
    {#each users as user}
      <a
        class="flex items-center gap-4 box hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
        href="/user/{user.username}"
      >
        <img
          class="profile-picture-md"
          src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col gap-2">
          <p class="text-gray-700">#{user.id}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-semibold">{user.displayName}</span>
            <span class="text-gray-500">@{user.username}</span>
          </div>
          <p>Role: {user.role}</p>
        </div>

        {#if user.role !== 'admin'}
          <IconButton
            class="ml-auto p-2"
            onclick={() => {
              showModal = 'delete';
              username = user.username;
            }}
          >
            <Icon type="delete" class="text-red-500" />
          </IconButton>
        {/if}
      </a>
    {/each}
  {/if}

  <Scroller
    disabled={disableScroller}
    hideText={searched && users.length <= 0}
    attachmentCallback={async () => {
      const res = await fetch(
        `/api/users?page=${++pageIndex}${searched ? `&name=${searchString}` : ''}`,
      );
      const newData = await res.json();
      disableScroller = res.headers.get('x-end-of-list') === 'true';
      users = [...users, ...newData];
    }}
    detachCleanup={() => {
      pageIndex = 1;
      disableScroller = false;
    }}
  />
</div>

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
  <ModalHeader>Delete account</ModalHeader>
  <ModalBody>
    Are you sure you want to delete this account? This action is irreversible and all data of this
    user can not be recovered. This user will no longer be able to login.
  </ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/delete-account"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
      <input type="text" name="username" value={username} hidden readonly />
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { HomeLayout, Scroller } from '$lib/components/layout';
  import { Divider, Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'delete' | null>(null);
  let username = $state<string>('');
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let users = $derived(data.users);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Users - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <ReturnHeader>Users</ReturnHeader>

  <div class="flex flex-col">
    {#each users as user}
      <a
        class="flex items-center gap-4 p-4 hover:bg-zinc-300/40 dark:hover:bg-zinc-900/40"
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
            class="ml-auto hover:bg-zinc-300 dark:hover:bg-zinc-800"
            onclick={() => {
              showModal = 'delete';
              username = user.username;
            }}
          >
            <Icon type="delete" class="text-red-500" />
          </IconButton>
        {/if}
      </a>
      <Divider />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(`/api/users?page=${++pageIndex}`);
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
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
      Are you sure you want to delete this account? This action is irreversible and all data can not
      be recovered. This user will no longer be able to login.
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
</HomeLayout>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { HomeLayout } from '$lib/components/layout';
  import { Icon } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'delete' | null>(null);
  let username = $state<string>('');

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Users - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="border-b border-gray-700 py-4 text-center text-xl font-semibold">Users</div>

  <div class="flex flex-col">
    {#each data.users as user}
      <a
        class="flex items-center gap-4 p-4 hover:bg-gray-900/40"
        href="/user/{user.username}"
        data-sveltekit-preload-data="tap"
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
            class="ml-auto hover:bg-gray-800"
            onclick={() => {
              showModal = 'delete';
              username = user.username;
            }}
          >
            <Icon type="delete" class="text-red-500" />
          </IconButton>
        {/if}
      </a>
      <hr class="text-gray-700" />
    {/each}
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
        <input hidden type="text" name="username" readonly value={username} />
      </form>
      <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

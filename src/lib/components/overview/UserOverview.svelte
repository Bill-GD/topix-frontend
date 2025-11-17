<script lang="ts">
  import { enhance } from '$app/forms';
  import { Icon } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';
  import type { User } from '$lib/utils/types';
  import Button from '../button/Button.svelte';

  let { user }: { user: User } = $props();

  const toaster = getToaster();
  let showModal = $state<boolean>(false);

  function hideModal() {
    showModal = false;
  }
</script>

<div class="relative">
  <a class="absolute inset-0 z-0" href="/user/{user.username}" aria-label="link"></a>
  <div class="flex items-center gap-4 box box-hover">
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
      <Button
        class="z-1 ml-auto p-2 dark:hover:bg-zinc-700"
        onclick={(ev) => {
          ev.preventDefault();
          showModal = true;
        }}
      >
        <Icon type="delete" class="text-red-500" />
      </Button>
    {/if}
  </div>
</div>

<Modal show={showModal} backdropCallback={hideModal} center>
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
      <input type="text" name="username" value={user.username} hidden readonly />
    </form>
    <Button class="w-full" type="base" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

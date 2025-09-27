<script lang="ts">
  import { Button, IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { HomeLayout } from '$lib/components/layout';
  import { getToaster } from '$lib/components/toast';
  import { capitalize, formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import { DropdownMenu, DropdownItem } from '$lib/components/dropdown';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '$lib/components/modal';
  import { PostUpload } from '$lib/components/upload';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showDeleteGroupModal = $state<boolean>(false);
  let showLeaveModal = $state<boolean>(false);
</script>

<svelte:head>
  <title>{data.group.name} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="flex items-center gap-4 border-b border-gray-700 p-2">
    <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
      <Icon type="back" size="sm" />
    </IconButton>
    <span class="text-lg font-semibold">Group</span>
  </div>

  <div class="w-full overflow-hidden px-1">
    <img
      class="object-fit rounded-b-md"
      src={data.group.bannerPicture ?? '/images/no-image.jpg'}
      alt="group-banner"
    />
  </div>

  <div class="flex items-center p-4">
    <div class="flex flex-col gap-2">
      <p class="text-4xl font-bold">{data.group.name}</p>
      <div class="text-gray-500">
        <span>{capitalize(data.group.visibility)}</span>
        <span>-</span>
        <span>{data.group.memberCount} member{data.group.memberCount > 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <Button class="hover:bg-gray-800" type="primary" disabled={data.group.joined}>
        {data.group.joined ? 'Joined' : 'Join'}
      </Button>

      <DropdownMenu class="ml-auto h-fit" position="bottom" align="right">
        {#snippet trigger()}
          <IconButton class="hover:bg-gray-800" round>
            <Icon type="menu" size="sm" />
          </IconButton>
        {/snippet}

        {#if data.self.username === data.group.owner.username}
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem class="text-red-500" onclick={() => (showDeleteGroupModal = true)}>
            Delete
          </DropdownItem>
        {:else}
          <DropdownItem class="text-red-500" onclick={() => (showLeaveModal = true)}>
            Leave
          </DropdownItem>
        {/if}
      </DropdownMenu>
    </div>
  </div>

  <div class="border-y border-gray-700">
    <PostUpload
      userPicture={data.self.profilePicture}
      formaction="?/add-post"
      placeholder="Add new post"
    />
  </div>

  {#if data.posts.length <= 0}
    <p class="w-full p-4 text-center text-2xl font-semibold">This group has no post.</p>
  {/if}
  {#each data.posts as post}
    <Post self={data.self} {post} compact />
    <hr class="text-gray-700" />
  {/each}

  <Modal bind:show={showDeleteGroupModal} center>
    <ModalHeader>Delete group</ModalHeader>
    <ModalBody>Are you sure you want to delete this group? This is irreversible.</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        method="post"
        action="?/delete-group"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster, 'Group deleted successfully.');
            await update();
          };
        }}
      >
        <Button class="w-full" type="danger" onclick={() => (showDeleteGroupModal = false)}>
          Delete
        </Button>
      </form>

      <Button class="w-full" type="dark" onclick={() => (showDeleteGroupModal = false)}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>

  <Modal bind:show={showLeaveModal} center>
    <ModalHeader>Leave group</ModalHeader>
    <ModalBody>Are you sure you want to leave this group?</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        method="post"
        action="?/leave-group"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <Button class="w-full" type="danger" onclick={() => (showLeaveModal = false)}>Leave</Button>
      </form>

      <Button class="w-full" type="dark" onclick={() => (showLeaveModal = false)}>Cancel</Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

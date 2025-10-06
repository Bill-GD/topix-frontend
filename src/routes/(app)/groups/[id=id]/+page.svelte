<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { FloatingLabelInput } from '$lib/components/input';
  import { HomeLayout } from '$lib/components/layout';
  import { Divider, Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { Post } from '$lib/components/post';
  import { ThreadOverview } from '$lib/components/thread';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'thread' | 'leave' | 'delete' | null>(null);
  let threadTitle = $state<string>('');

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>{data.group.name} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <ReturnHeader>Group</ReturnHeader>

  <img
    class="object-fit rounded-b-lg"
    src={data.group.bannerPicture ?? '/images/no-image.jpg'}
    alt="group-banner"
  />

  <div class="flex flex-col gap-2 p-4">
    <p class="text-4xl font-bold">{data.group.name}</p>

    {#if data.group.description}
      <p>{data.group.description}</p>
    {/if}

    <div class="flex items-center">
      <div class="text-gray-500">
        <span>{capitalize(data.group.visibility)}</span>
        <span>-</span>
        <span>{data.group.memberCount} member{data.group.memberCount > 1 ? 's' : ''}</span>
      </div>

      <div class="ml-auto flex items-center gap-2">
        {#if data.group.status !== null}
          <Button class="hover:bg-gray-800" type="primary" disabled>
            {data.group.status ? 'Joined' : 'Pending'}
          </Button>
        {:else}
          <form
            class="w-full"
            action="?/join-group"
            method="post"
            use:enhance={() => {
              return async ({ result, update }) => {
                await formResultToast(result, toaster);
                await update();
              };
            }}
          >
            <Button class="hover:bg-gray-800" type="primary">Join</Button>
          </form>
        {/if}

        <DropdownMenu class="ml-auto" position="bottom" align="right">
          {#snippet trigger()}
            <IconButton round>
              <Icon type="menu" size="sm" />
            </IconButton>
          {/snippet}

          <DropdownItem href="/groups/{data.group.id}/members/all">Members</DropdownItem>
          {#if data.self.id === data.group.owner.id}
            <DropdownItem href="/groups/{data.group.id}/pending">Pending posts</DropdownItem>
            <DropdownItem href="/groups/{data.group.id}/settings/general">Settings</DropdownItem>
            <DropdownItem class="text-red-500" onclick={() => (showModal = 'delete')}>
              Delete
            </DropdownItem>
          {:else if data.group.status !== null}
            <DropdownItem class="text-red-500" onclick={() => (showModal = 'leave')}>
              Leave
            </DropdownItem>
          {/if}
        </DropdownMenu>
      </div>
    </div>
  </div>

  {#if data.group.status === true}
    <Divider />
    <PostUpload
      userPicture={data.self.profilePicture}
      formaction="?/add-post"
      placeholder="Add new post"
      tags={data.tags}
      groupApproved={data.self.id === data.group.owner.id}
    />
  {/if}

  {#if data.posts.length <= 0}
    <p class="empty-noti-text">This group has no post.</p>
  {/if}
  {#each data.posts as post}
    <Divider />
    <Post self={data.self} {post} compact />
  {/each}

  {#snippet right()}
    <div class="rounded-md border border-gray-700 2xl:max-w-1/2">
      <div class="flex items-baseline p-4">
        <p class="text-xl font-semibold">Threads</p>
        {#if data.group.status === true}
          <IconButton type="success" class="ml-auto" onclick={() => (showModal = 'thread')}>
            <Icon type="add" size="xs" />
          </IconButton>
        {/if}
      </div>

      {#if data.threads.length <= 0}
        <Divider />
        <p class="w-full px-4 py-2">This group has no thread.</p>
      {:else}
        {#each data.threads as thread}
          <Divider />
          <ThreadOverview {thread} />
        {/each}
      {/if}
    </div>
  {/snippet}

  <Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
    <ModalHeader>Delete group</ModalHeader>
    <ModalBody>Are you sure you want to delete this group? This is irreversible.</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        action="?/delete-group"
        method="post"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster, 'Group deleted successfully.');
            await update();
          };
        }}
      >
        <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
      </form>

      <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
    </ModalFooter>
  </Modal>

  <Modal show={showModal === 'leave'} backdropCallback={hideModal} center>
    <ModalHeader>Leave group</ModalHeader>
    <ModalBody>Are you sure you want to leave this group?</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        action="?/leave-group"
        method="post"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <Button class="w-full" type="danger" onclick={hideModal}>Leave</Button>
      </form>

      <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
    </ModalFooter>
  </Modal>

  <Modal show={showModal === 'thread'} backdropCallback={hideModal} center>
    <ModalHeader>Create thread</ModalHeader>
    <ModalBody>
      <form
        class="flex w-full flex-col gap-4"
        action="?/create-thread"
        method="post"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <FloatingLabelInput
          class="w-full"
          name="thread-title"
          labelClass="bg-gray-200 dark:bg-gray-900"
          bind:value={threadTitle}
        >
          Title
        </FloatingLabelInput>

        {#if data.tags && data.tags.length > 0}
          <select
            class="rounded-md border-gray-700 bg-gray-200 dark:bg-gray-900"
            name="tag-id"
            id="post-tag-select"
          >
            {#each data.tags as tag}
              <option disabled selected value hidden> -- choose tag -- </option>
              <option value={tag.id}>{tag.name}</option>
            {/each}
          </select>
        {/if}

        <div class="flex w-full flex-col gap-2 md:flex-row">
          <Button class="w-full" type="success" onclick={hideModal}>Create</Button>
          <Button
            class="w-full"
            type="dark"
            onclick={(ev) => {
              ev.preventDefault();
              hideModal();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </ModalBody>
  </Modal>
</HomeLayout>

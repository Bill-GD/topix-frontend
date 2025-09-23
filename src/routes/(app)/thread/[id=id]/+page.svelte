<script lang="ts">
  import { Button, IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '$lib/components/modal';
  import { DropdownMenu, DropdownItem } from '$lib/components/dropdown';
  import { Input } from '$lib/components/input';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showPostModal = $state<boolean>(false);
  let showDeleteThreadModal = $state<boolean>(false);
  let editingTitle = $state<boolean>(false);
  let title = $state<string>(data.thread.title);
</script>

<svelte:head>
  <title>{data.thread.title} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="thread-container">
    <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
      <Icon type="back" size="sm" />
    </IconButton>

    <div class="flex">
      <div class="flex flex-col gap-2 text-gray-500">
        {#if editingTitle}
          <form
            class="flex items-center gap-2"
            action="?/update-title"
            id="update-thread-{data.thread.id}"
            method="post"
            use:enhance={() => {
              return async ({ result, update }) => {
                await formResultToast(result, toaster, 'Thread deleted successfully.');
                await update();
                editingTitle = false;
              };
            }}
          >
            <Input
              type="text"
              class="text-white"
              placeholder="Title"
              name="new-title"
              value={title}
            />
            <Button class="h-fit px-2" type="success">
              <Icon type="check" size="sm" />
            </Button>
            <IconButton class="h-fit" variant="danger" onclick={() => (editingTitle = false)}>
              <Icon type="close" size="sm" />
            </IconButton>
          </form>
        {:else}
          <p class="text-4xl font-semibold text-white">{data.thread.title}</p>
        {/if}
        <div>
          <span>
            Created {getTimeAgo(Date.parse(data.thread.dateCreated), true)}
          </span>
          {#if data.thread.dateUpdated}
            <span>-</span>
            <span>
              Updated {getTimeAgo(Date.parse(data.thread.dateUpdated), true)}
            </span>
          {/if}
        </div>
        <p>
          {data.thread.postCount} post{data.thread.postCount > 1 ? 's' : ''}
        </p>
      </div>

      <DropdownMenu class="ml-auto h-fit" position="bottom" align="right">
        {#snippet trigger()}
          <div class="cursor-pointer rounded-full p-2 hover:bg-gray-800">
            <Icon type="menu" size="sm" />
          </div>
        {/snippet}

        <DropdownItem>Follow</DropdownItem>
        {#if data.self.username === data.thread.owner.username}
          <DropdownItem onclick={() => (editingTitle = true)}>Edit</DropdownItem>
          <DropdownItem class="text-red-500" onclick={() => (showDeleteThreadModal = true)}>
            Delete
          </DropdownItem>
        {/if}
      </DropdownMenu>
    </div>

    {#if data.self.username === data.thread.owner.username}
      <Button type="success" onclick={() => (showPostModal = true)}>Add post</Button>
    {/if}
  </div>

  {#if data.posts.length <= 0}
    <p class="w-full p-4 text-center text-2xl font-semibold">This thread has no post.</p>
  {/if}
  {#each data.posts as post}
    <Post self={data.self} {post} compact />
    <hr class="text-gray-700" />
  {/each}

  <Modal class="min-w-1/2" id="modal-add-post" bind:show={showPostModal}>
    <ModalHeader>Add new post</ModalHeader>
    <ModalBody>
      <PostUpload
        userPicture={data.self.profilePicture}
        formaction="?/add-post"
        placeholder="Add new post"
        postCallback={() => (showPostModal = false)}
      />
    </ModalBody>
  </Modal>

  <Modal id="modal-delete-thread-{data.thread.id}" bind:show={showDeleteThreadModal} center>
    <ModalHeader>Delete thread</ModalHeader>
    <ModalBody>Are you sure you want to delete this thread? This is irreversible.</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        method="post"
        id="delete-form-{data.thread.id}"
        action="?/delete-thread"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster, 'Thread deleted successfully.');
            await update();
          };
        }}
      >
        <input type="text" name="thread-id" value={data.thread.id} hidden readonly />
        <Button class="w-full" type="danger" onclick={() => (showDeleteThreadModal = false)}>
          Delete
        </Button>
      </form>

      <Button class="w-full" type="dark" onclick={() => (showDeleteThreadModal = false)}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .thread-container {
    @apply flex flex-col gap-4 border-b border-gray-700 p-4;
  }
</style>

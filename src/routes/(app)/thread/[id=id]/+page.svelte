<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { Input } from '$lib/components/input';
  import { HomeLayout } from '$lib/components/layout';
  import { Icon } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { Post } from '$lib/components/post';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'post' | 'thread' | null>(null);
  let editingTitle = $state<boolean>(false);
  let title = $derived<string>(data.thread.title);

  function hideModal() {
    showModal = null;
  }
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
            method="post"
            use:enhance={() => {
              return async ({ result, update }) => {
                await formResultToast(result, toaster);
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
            <IconButton class="h-fit px-2" variant="success" type="submit">
              <Icon type="check" size="sm" />
            </IconButton>
            <IconButton class="h-fit" variant="danger" onclick={() => (editingTitle = false)}>
              <Icon type="close" size="sm" />
            </IconButton>
          </form>
        {:else}
          <p class="text-4xl font-semibold text-white">{data.thread.title}</p>
        {/if}
        <div>
          <p>Created by @{data.thread.owner.username}</p>
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
          <IconButton class="hover:bg-gray-800" round>
            <Icon type="menu" size="sm" />
          </IconButton>
        {/snippet}

        <DropdownItem>Follow</DropdownItem>
        {#if data.self.username === data.thread.owner.username}
          <DropdownItem onclick={() => (editingTitle = true)}>Edit</DropdownItem>
          <DropdownItem class="text-red-500" onclick={() => (showModal = 'thread')}>
            Delete
          </DropdownItem>
        {/if}
      </DropdownMenu>
    </div>

    {#if data.self.username === data.thread.owner.username}
      <Button type="success" onclick={() => (showModal = 'post')}>Add post</Button>
    {/if}
  </div>

  {#if data.posts.length <= 0}
    <p class="w-full p-4 text-center text-2xl font-semibold">This thread has no post.</p>
  {/if}
  {#each data.posts as post}
    <Post self={data.self} {post} compact />
    <hr class="text-gray-700" />
  {/each}

  <Modal show={showModal === 'post'} backdropCallback={hideModal}>
    <ModalHeader class="text-center">Add new post</ModalHeader>
    <ModalBody>
      <PostUpload
        userPicture={data.self.profilePicture}
        formaction="?/add-post"
        placeholder="Add new post"
        postCallback={hideModal}
      />
    </ModalBody>
  </Modal>

  <Modal show={showModal === 'thread'} backdropCallback={hideModal} center>
    <ModalHeader>Delete thread</ModalHeader>
    <ModalBody>Are you sure you want to delete this thread? This is irreversible.</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        action="?/delete-thread"
        method="post"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster, 'Thread deleted successfully.');
            await update();
          };
        }}
      >
        <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
      </form>

      <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .thread-container {
    @apply flex flex-col gap-4 border-b border-gray-700 p-4;
  }
</style>

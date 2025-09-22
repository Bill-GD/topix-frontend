<script lang="ts">
  import { Button, IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '$lib/components/modal';
  import { DropdownMenu, DropdownItem } from '$lib/components/dropdown';
  import { Input } from '$lib/components/input';
  import { getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  let showPostModal = $state<boolean>(false);
  let showDeleteThreadModal = $state<boolean>(false);
  let editingTitle = $state<boolean>(false);
  let title = $state<string>(data.thread.title);
</script>

<svelte:head>
  <title>Home - topix</title>
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
          >
            <Input
              type="text"
              class="text-white"
              placeholder="Title"
              name="new-title"
              value={title}
            />
            <IconButton
              class="h-fit"
              variant="success"
              onclick={() => {
                (
                  document.querySelector(`form#update-thread-${data.thread.id}`) as HTMLFormElement
                ).submit();
              }}
            >
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

      <DropdownMenu class="ml-auto h-fit" position="bottom" align="end" origin="tr">
        {#snippet trigger()}
          <IconButton class="p-2 hover:bg-gray-800">
            <Icon type="menu" size="sm" />
          </IconButton>
        {/snippet}

        <DropdownItem href="">Follow</DropdownItem>
        {#if data.self.username === data.thread.owner.username}
          <DropdownItem href="" onclick={() => (editingTitle = true)}>Edit</DropdownItem>
          <DropdownItem class="text-red-500" href="" onclick={() => (showDeleteThreadModal = true)}>
            Delete
            <form method="post" id="delete-form-{data.thread.id}" action="?/delete-thread" hidden>
              <input type="text" name="thread-id" value={data.thread.id} hidden readonly />
            </form>
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
        errorText={form?.success === false ? form?.message : ''}
        userPicture={data.self.profilePicture}
        formaction="?/add-post"
        placeholder="Add new post"
      />
    </ModalBody>
  </Modal>

  <Modal id="modal-delete-thread-{data.thread.id}" bind:show={showDeleteThreadModal} center>
    <ModalHeader>Delete thread</ModalHeader>
    <ModalBody>Are you sure you want to delete this thread? This is irreversible.</ModalBody>
    <ModalFooter>
      <Button
        class="w-full"
        type="danger"
        onclick={() => {
          showDeleteThreadModal = false;
          (
            document.querySelector(`form#delete-form-${data.thread.id}`) as HTMLFormElement | null
          )?.submit();
        }}
      >
        Delete
      </Button>
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

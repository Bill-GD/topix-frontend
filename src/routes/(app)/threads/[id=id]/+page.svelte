<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Flair, Icon, ReturnHeader, VisibilitySelector } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { Post } from '$lib/components/post';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { capitalize, formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'post' | 'delete' | 'update' | null>(null);
  let title = $derived<string>(data.thread.title);
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let posts = $derived(data.posts);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>{data.thread.title} - topix</title>
</svelte:head>

<ReturnHeader>Thread</ReturnHeader>

{#if data.thread.visibility !== 'public' && data.self.id !== data.thread.owner.id}
  <p class="empty-noti-text">This thread is privated by the author.</p>
{:else}
  <div class="mb-4 flex flex-col gap-4 box">
    <div class="flex">
      <div class="flex flex-col gap-2">
        <p class="text-4xl font-semibold">{data.thread.title}</p>

        {#if data.thread.tag}
          <Flair tag={data.thread.tag} />
        {/if}

        <div class="text-gray-500">
          <div class="flex items-center gap-2">
            Created by @{data.thread.owner.username}
            •
            {#if data.thread.visibility === 'private'}
              <Icon type="lock" size="xs" />
            {:else if data.thread.visibility === 'hidden'}
              <Icon type="eyeSlash" size="xs" />
            {/if}
            {capitalize(data.thread.visibility)}
          </div>
          <span>
            Created {getTimeAgo(Date.parse(data.thread.dateCreated), true)}
          </span>
          {#if data.thread.dateUpdated}
            <span>•</span>
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
          <IconButton class="p-2" round>
            <Icon type="menu" size="sm" />
          </IconButton>
        {/snippet}

        {#if data.self.id !== data.thread.owner.id}
          {#if data.thread.followed}
            <form
              action="?/unfollow"
              method="post"
              use:enhance={() => {
                return async ({ result, update }) => {
                  await formResultToast(result, toaster);
                  await update();
                };
              }}
            >
              <DropdownItem class="text-red-500">Unfollow</DropdownItem>
            </form>
          {:else}
            <form
              action="?/follow"
              method="post"
              use:enhance={() => {
                return async ({ result, update }) => {
                  await formResultToast(result, toaster);
                  await update();
                };
              }}
            >
              <DropdownItem>Follow</DropdownItem>
            </form>
          {/if}
        {/if}
        {#if data.self.id === data.thread.owner.id}
          <DropdownItem onclick={() => (showModal = 'update')}>Edit</DropdownItem>
          <DropdownItem class="text-red-500" onclick={() => (showModal = 'delete')}>
            Delete
          </DropdownItem>
        {/if}
      </DropdownMenu>
    </div>

    {#if data.self.id === data.thread.owner.id && ((data.thread.groupId && data.thread.joinedGroup === true) || !data.thread.groupId)}
      <Button type="success" onclick={() => (showModal = 'post')}>Add post</Button>
    {/if}
  </div>

  {#if data.posts.length <= 0}
    <p class="empty-noti-text">This thread has no post.</p>
  {:else}
    <div class="flex flex-col gap-4">
      {#each posts as post}
        <Post self={data.self} {post} />
      {/each}

      <Scroller
        disabled={disableScroller}
        attachmentCallback={async () => {
          const res = await fetch(`/api/posts?threadId=${data.thread.id}&page=${++pageIndex}`);
          const newData = await res.json();
          if (newData.length <= 0) disableScroller = true;
          posts = [...posts, ...newData];
        }}
        detachCleanup={() => {
          pageIndex = 1;
          disableScroller = false;
        }}
      />
    </div>
  {/if}
{/if}

<Modal show={showModal === 'post'} backdropCallback={hideModal}>
  <ModalHeader class="text-center">Add new post</ModalHeader>
  <ModalBody>
    <PostUpload
      userPicture={data.self.profilePicture}
      formaction="?/add-post"
      placeholder="Add new post"
      postCallback={hideModal}
      groupId={data.thread.groupId ?? undefined}
      groupApproved
      hideBox
    />
  </ModalBody>
</Modal>

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
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
      {#if data.thread.groupId}
        <input type="number" name="group-id" value={data.thread.groupId} hidden readonly />
      {/if}
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
    </form>

    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal show={showModal === 'update'} backdropCallback={hideModal} center>
  <ModalHeader>Update thread</ModalHeader>
  <form
    class="flex w-full flex-col gap-4"
    action="?/update-thread"
    method="post"
    use:enhance={() => {
      return async ({ result, update }) => {
        await formResultToast(result, toaster);
        await update({ reset: false });
      };
    }}
  >
    <Input type="text" class="dark:text-white" placeholder="Title" name="new-title" value={title} />

    {#if data.thread.groupId === null}
      <VisibilitySelector visibility={data.thread.visibility} />
    {/if}

    <ModalFooter>
      <Button class="w-full" type="success" onclick={hideModal}>Update</Button>
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
    </ModalFooter>
  </form>
</Modal>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { HomeLayout } from '$lib/components/layout';
  import { Divider, Icon, ReturnHeader, VisibilitySelector } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { Post } from '$lib/components/post';
  import { ThreadOverview } from '$lib/components/thread';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'thread' | null>(null);
  let threadTitle = $state<string>('');

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>{data.user.displayName} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <ReturnHeader>{data.user.displayName}</ReturnHeader>

  <div class="flex flex-col gap-2 border-b border-gray-700 p-4">
    <div class="flex items-start gap-4">
      <img
        class="profile-picture-md"
        src={data.user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
        alt="user-profile"
      />

      <div class="flex flex-col justify-start gap-2">
        <div class="flex items-baseline gap-4">
          <span class="text-2xl font-semibold">{data.user.displayName}</span>
          <span class="text-base text-gray-500">@{data.user.username}</span>
        </div>
        <p class="text-wrap overflow-ellipsis">
          {data.user.description ?? 'No description.'}
        </p>
      </div>

      <div class="ml-auto flex flex-col gap-4">
        <IconButton type="dark" class="w-full">
          <Icon type="follow" size="sm" />
        </IconButton>
        <IconButton type="dark" class="w-full">
          <Icon type="message" size="sm" />
        </IconButton>
      </div>
    </div>

    <div class="flex items-baseline gap-6 px-4 py-2 font-semibold">
      <p>Following: {data.user.followingCount}</p>
      <p>Follower: {data.user.followerCount}</p>
    </div>
  </div>

  {#if data.self.id === data.user.id}
    <PostUpload
      userPicture={data.self.profilePicture}
      formaction="?/post-upload"
      showVisibilitySelector
    />
  {/if}

  {#each data.posts as post (post.id)}
    <Divider />
    <Post self={data.self} {post} />
  {/each}

  {#snippet right()}
    <div class="rounded-md border border-gray-700 2xl:max-w-1/2">
      <div class="flex items-baseline p-4">
        <p class="text-xl font-semibold">Threads</p>
        {#if data.self.id === data.user.id}
          <IconButton type="success" class="ml-auto" onclick={() => (showModal = 'thread')}>
            <Icon type="add" size="xs" />
          </IconButton>
        {/if}
      </div>

      {#if data.threads.length <= 0}
        <Divider />
        <p class="w-full px-4 py-2">This user has no thread.</p>
      {:else}
        {#each data.threads as thread}
          <Divider />
          <ThreadOverview {thread} />
        {/each}
      {/if}
    </div>
  {/snippet}

  <Modal show={showModal === 'thread'} backdropCallback={hideModal} center>
    <ModalHeader>Create thread</ModalHeader>
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

      <VisibilitySelector />

      <ModalFooter>
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
      </ModalFooter>
    </form>
  </Modal>
</HomeLayout>

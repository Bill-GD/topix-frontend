<script lang="ts">
  import { IconButton, Button } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '$lib/components/modal';
  import { FloatingLabelInput } from '$lib/components/input';
  import { ThreadOverview } from '$lib/components/thread';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<boolean>(false);
  let threadTitle = $state<string>('');
</script>

<svelte:head>
  <title>{data.user.displayName} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="profile-overview">
    <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
      <Icon type="back" />
    </IconButton>

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

      <div class="flex flex-col gap-4">
        <IconButton variant="dark" class="w-full">
          <Icon type="follow" size="sm" />
        </IconButton>
        <IconButton variant="dark" class="w-full">
          <Icon type="message" size="sm" />
        </IconButton>
      </div>
    </div>

    <div class="follow-stats">
      <p>Following: {data.user.followingCount}</p>
      <p>Follower: {data.user.followerCount}</p>
    </div>
  </div>

  {#if data.self.id === data.user.id}
    <PostUpload userPicture={data.self.profilePicture} formaction="?/post-upload" />
  {/if}

  {#each data.posts as post (post.id)}
    <hr class="text-gray-700" />
    <Post self={data.self} {post} />
  {/each}

  {#snippet right()}
    <div class="rounded-md border border-gray-700 2xl:max-w-1/2">
      <div class="flex items-baseline p-4">
        <p class="text-xl font-semibold">Threads</p>
        {#if data.self.id === data.user.id}
          <IconButton
            variant="success"
            class="ml-auto flex hover:bg-gray-800"
            onclick={() => (showModal = true)}
          >
            <Icon type="add" size="xs" />
          </IconButton>
        {/if}
      </div>

      {#if data.threads.length <= 0}
        <span>This user has no thread.</span>
      {:else}
        {#each data.threads as thread}
          <hr class="text-gray-700" />
          <ThreadOverview {thread} />
        {/each}
      {/if}
    </div>
  {/snippet}

  <Modal id="modal-create-thread" bind:show={showModal} center>
    <ModalHeader>Create thread</ModalHeader>
    <ModalBody>
      <FloatingLabelInput labelClass="bg-gray-900" bind:value={threadTitle}>
        Title
      </FloatingLabelInput>
    </ModalBody>
    <ModalFooter>
      <form
        action="?/create-thread"
        method="post"
        id="create-thread-form"
        class="w-full"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <Button
          class="w-full"
          type="success"
          onclick={() => {
            showModal = false;
            // (document.querySelector('form#create-thread-form') as HTMLFormElement | null)?.submit();
          }}
        >
          Create
        </Button>
        <input hidden type="text" name="thread-title" readonly value={threadTitle} />
      </form>
      <Button class="w-full" type="dark" onclick={() => (showModal = false)}>Cancel</Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .profile-overview {
    @apply flex flex-col gap-2 border-b border-gray-700 p-4;
  }

  .follow-stats {
    @apply flex items-baseline gap-6 px-4 py-2 font-semibold;
  }
</style>

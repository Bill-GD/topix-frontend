<script lang="ts">
  import { enhance } from '$app/forms';
  import { getToaster } from '$lib/components/toast';
  import type { PendingPostProps } from '$lib/components/types';
  import { formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import Button from '../button/Button.svelte';
  import IconButton from '../button/IconButton.svelte';
  import Link from '../link/Link.svelte';
  import Flair from '../misc/Flair.svelte';
  import Icon from '../misc/Icon.svelte';
  import Modal from '../modal/Modal.svelte';
  import ModalBody from '../modal/ModalBody.svelte';
  import ModalFooter from '../modal/ModalFooter.svelte';
  import ModalHeader from '../modal/ModalHeader.svelte';

  let { class: className, post }: PendingPostProps = $props();

  const toaster = getToaster();
  const isImages = $derived(post.mediaPaths.every((m) => m.includes('image')));
  const isVideo = $derived(post.mediaPaths.every((m) => m.includes('video')));

  let imageIndex = $state<number>(0);
  let showModal = $state<'approve' | 'remove' | null>(null);

  function hideModal() {
    showModal = null;
  }
</script>

<div class={['flex items-center gap-2 p-4', className]}>
  <img
    class="profile-picture-sm"
    src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class="flex flex-col gap-3">
    <div class="flex flex-col">
      <div class="flex items-baseline gap-2 text-gray-500">
        <Link class="flex items-baseline gap-2" href="/user/{post.owner.username}">
          <span class="text-xl text-white decoration-white hover:underline">
            {post.owner.displayName}
          </span>
          <span class="text-gray-500">@{post.owner.username}</span>
        </Link>

        <span>-</span>
        <span>{getTimeAgo(Date.parse(post.dateCreated))}</span>
      </div>
    </div>

    {#if post.tag}
      <Flair tag={post.tag} />
    {/if}

    <span class="whitespace-pre-line">{post.content}</span>

    {#if post.mediaPaths.length > 0}
      {#if isImages}
        <div class="relative min-w-1/2">
          {#if imageIndex > 0}
            <IconButton
              class="absolute top-1/2 left-0 h-full -translate-y-1/2 hover:bg-gray-900/20"
              round={false}
              onclick={() => (imageIndex = Math.max(0, imageIndex - 1))}
            >
              <Icon type="back" size="sm" />
            </IconButton>
          {/if}

          <img
            class="w-full rounded-lg"
            src={post.mediaPaths[imageIndex]}
            alt="post-image-{imageIndex}"
          />

          {#if post.mediaPaths.length > 1}
            <div class="absolute bottom-1 left-1/2 z-2 flex -translate-x-1/2 gap-1">
              {#each post.mediaPaths as _, index}
                <span
                  class={[
                    'h-2 w-2 rounded-full border border-white',
                    index === imageIndex && 'bg-white',
                  ]}
                ></span>
              {/each}
            </div>
          {/if}

          {#if imageIndex < post.mediaPaths.length - 1}
            <IconButton
              class="absolute top-1/2 right-0 h-full -translate-y-1/2 hover:bg-gray-900/20"
              round={false}
              onclick={() => (imageIndex = Math.min(post.mediaPaths.length - 1, imageIndex + 1))}
            >
              <Icon type="next" size="sm" />
            </IconButton>
          {/if}
        </div>
      {/if}

      {#if isVideo}
        <!-- svelte-ignore a11y_media_has_caption -->
        <video class={['w-full min-w-1/2 rounded-lg']} controls>
          <source src={post.mediaPaths[0]} type="video/mp4" />
        </video>
      {/if}
    {/if}
  </div>

  <div class="ml-auto flex gap-2">
    <IconButton type="success" onclick={() => (showModal = 'approve')}>
      <Icon type="check" size="sm" />
    </IconButton>
    <IconButton type="danger" onclick={() => (showModal = 'remove')}>
      <Icon type="close" size="sm" />
    </IconButton>
  </div>
</div>

<Modal show={showModal === 'approve'} backdropCallback={hideModal} center>
  <ModalHeader>Approve post</ModalHeader>
  <ModalBody>Are you sure you want to approve this post?</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/approve-post"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <input type="number" name="post-id" value={post.id} hidden readonly />
      <Button class="w-full" type="success" onclick={hideModal}>Approve</Button>
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal show={showModal === 'remove'} backdropCallback={hideModal} center>
  <ModalHeader>Remove post</ModalHeader>
  <ModalBody>Are you sure you want to remove this post?</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/remove-post"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <input type="number" name="post-id" value={post.id} hidden readonly />
      <Button class="w-full" type="danger" onclick={hideModal}>Remove</Button>
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

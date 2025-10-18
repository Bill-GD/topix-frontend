<script lang="ts">
  import { enhance } from '$app/forms';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import type { Post } from '$lib/utils/types';
  import type { ClassValue } from 'svelte/elements';
  import Button from '../button/Button.svelte';
  import IconButton from '../button/IconButton.svelte';
  import Flair from '../misc/Flair.svelte';
  import Icon from '../misc/Icon.svelte';
  import Modal from '../modal/Modal.svelte';
  import ModalBody from '../modal/ModalBody.svelte';
  import ModalFooter from '../modal/ModalFooter.svelte';
  import ModalHeader from '../modal/ModalHeader.svelte';
  import ImageCarousel from './ImageCarousel.svelte';

  let {
    class: className,
    post,
  }: {
    class?: ClassValue;
    post: Post;
  } = $props();

  const toaster = getToaster();
  const isImages = $derived(post.mediaPaths.every((m) => m.includes('image')));
  const isVideo = $derived(post.mediaPaths.every((m) => m.includes('video')));
  let showModal = $state<'approve' | 'remove' | null>(null);

  function hideModal() {
    showModal = null;
  }
</script>

<div class={['flex items-center gap-2 box', className]}>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <img
        class="profile-picture-sm"
        src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
        alt="profile"
      />
      <div class="flex flex-col">
        <div class="flex items-baseline gap-2 text-gray-500">
          <a
            class="font-semibold text-black hover:underline dark:text-white dark:decoration-white"
            href="/user/{post.owner.username}"
          >
            {post.owner.displayName}
          </a>

          <span>•</span>
          <span>{getTimeAgo(Date.parse(post.dateCreated))}</span>
        </div>
      </div>
    </div>

    {#if post.tag}
      <Flair tag={post.tag} compact />
    {/if}

    <span class="whitespace-pre-line">{post.content}</span>

    {#if post.mediaPaths.length > 0}
      {#if isImages}
        <ImageCarousel images={post.mediaPaths} />
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

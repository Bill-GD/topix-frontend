<script lang="ts">
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import type { PostProps } from '$lib/components/types';
  import Link from '../link/Link.svelte';
  import IconButton from '../button/IconButton.svelte';
  import Icon from '../misc/Icon.svelte';
  import DropdownMenu from '../dropdown/DropdownMenu.svelte';
  import DropdownItem from '../dropdown/DropdownItem.svelte';
  import Modal from '../modal/Modal.svelte';
  import ModalHeader from '../modal/ModalHeader.svelte';
  import ModalBody from '../modal/ModalBody.svelte';
  import ModalFooter from '../modal/ModalFooter.svelte';
  import Button from '../button/Button.svelte';

  let {
    class: className,
    self,
    post,
    detail = false,
    compact = false,
    parent = false,
  }: PostProps = $props();

  const toaster = getToaster();
  const isImages = $derived(post.mediaPaths.every((m) => m.includes('image')));
  const isVideo = $derived(post.mediaPaths.every((m) => m.includes('video')));
  const isReply = post.parentPost !== undefined;
  const reactions = {
    like: 'text-sky-500',
    heart: 'text-red-500',
    laugh: 'text-yellow-500',
    sad: 'text-yellow-500',
    angry: 'text-red-500',
  };

  let reaction = $state((post.reaction ?? 'noReaction') as keyof typeof reactions | 'noReaction');
  let reactionCount = $state(post.reactionCount);
  let imageIndex = $state<number>(0);
  let showModal = $state<boolean>(false);

  let reactInput: HTMLInputElement;

  onMount(() => {
    const main = document.getElementById(`post-${post.id}`) as HTMLElement;
    if (!detail) {
      main.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement;
        if (
          target.closest('video') ||
          target.closest('img') ||
          target.closest('svg') ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.dropdown-menu') ||
          target.closest('.react-button') ||
          target.closest('.reaction-button')
        ) {
          return;
        }

        ev.preventDefault();
        window.location.href = `/post/${post.id}`;
      });
    }

    reactInput = document.getElementById(`react-input-${post.id}`) as HTMLInputElement;
  });

  function reactHandle(newReaction: keyof typeof reactions) {
    if (newReaction === reaction) {
      reaction = 'noReaction';
      reactionCount--;
    } else {
      if (reaction === 'noReaction') reactionCount++;
      reaction = newReaction;
    }

    reactInput.value = reaction;
  }
</script>

<div
  class={[
    'main',
    compact ? 'gap-2' : 'gap-4',
    !detail && 'cursor-pointer hover:bg-gray-900/40',
    className,
  ]}
  id="post-{post.id}"
>
  <img
    class="profile-picture-sm"
    src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class={['flex flex-col', compact ? 'gap-3' : 'gap-6']}>
    <div class="flex flex-col">
      {#if !detail && isReply}
        <span class="text-xs text-gray-500">
          replied to {post.parentPost?.owner.displayName}
        </span>
      {/if}

      <div class="flex items-baseline gap-2 text-gray-500">
        <Link class="flex items-baseline gap-2" href="/user/{post.owner.username}">
          <span class="text-xl text-white decoration-white hover:underline">
            {post.owner.displayName}
          </span>
          <span class="text-gray-500">@{post.owner.username}</span>
        </Link>

        <span>-</span>
        <span>{getTimeAgo(Date.parse(post.dateCreated))}</span>
        {#if post.dateUpdated}
          <span>-</span>
          <span>edited {getTimeAgo(Date.parse(post.dateUpdated))}</span>
        {/if}
      </div>
    </div>

    {#if compact}
      <p class="line-clamp-2 whitespace-pre-line">{post.content}</p>
    {:else}
      <span class="whitespace-pre-line">{post.content}</span>
    {/if}

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

    <!-- reactions -->
    {#if !parent}
      <div class="flex w-fit gap-6">
        <form
          action="?/react"
          method="post"
          id="react-form-{post.id}"
          use:enhance={() => {
            return async ({ result, update }) => {
              await formResultToast(result, toaster);
              await update();
            };
          }}
        >
          <input type="text" name="reaction" id="react-input-{post.id}" hidden readonly />
          <input type="text" name="post-id" value={post.id} hidden readonly />

          <DropdownMenu position="top" align="left" horizontal>
            {#snippet trigger()}
              <div class="react-button flex cursor-pointer items-center gap-2">
                {reactionCount}
                <Icon
                  type={reaction}
                  class={[reaction !== 'noReaction' && (reactions[reaction] as string)]}
                  size="sm"
                />
              </div>
            {/snippet}

            {#each Object.entries(reactions) as [type, color]}
              <DropdownItem
                class="reaction-button"
                noHover
                onclick={() => reactHandle(type as keyof typeof reactions)}
              >
                <Icon type={type as keyof typeof reactions} class={color} size="sm" hover />
              </DropdownItem>
            {/each}
          </DropdownMenu>
        </form>

        <div class="flex items-center gap-2">
          {post.replyCount}
          <Icon type="reply" size="sm" />
        </div>
      </div>
    {/if}
  </div>

  <!-- option menu -->
  {#if !parent}
    <DropdownMenu class="ml-auto h-fit" position="bottom" align="right">
      {#snippet trigger()}
        <div class="cursor-pointer rounded-full p-2 hover:bg-gray-800">
          <Icon type="menu" size="sm" />
        </div>
      {/snippet}

      {#if detail && self.username === post.owner.username}
        <DropdownItem>Edit</DropdownItem>
      {/if}
      {#if self.role === 'admin' || self.username === post.owner.username}
        <DropdownItem class="text-red-500" onclick={() => (showModal = true)}>Delete</DropdownItem>
      {/if}
    </DropdownMenu>
  {/if}
</div>

<Modal class="absolute" id="delete-modal-post-{post.id}" bind:show={showModal} center>
  <ModalHeader>Delete post</ModalHeader>
  <ModalBody>Are you sure you want to delete this post? This is irreversible.</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      method="post"
      id="delete-form-{post.id}"
      action="?/delete-post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={() => (showModal = false)}>Delete</Button>
      <input type="text" name="post-id" value={post.id} hidden readonly />
    </form>
    <Button class="w-full" type="dark" onclick={() => (showModal = false)}>Cancel</Button>
  </ModalFooter>
</Modal>

<!--
@component
Post component: shows OP, content, interaction counts...  
Reaction requires `?/react` formaction

-->

<style lang="postcss">
  @reference '@/app.css';

  .main {
    @apply flex p-4;
  }

  .main {
    img,
    video {
      cursor: initial;
    }
  }
</style>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { getToaster } from '$lib/components/toast';
  import type { PostProps } from '$lib/components/types';
  import { formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import { onMount } from 'svelte';
  import Button from '../button/Button.svelte';
  import IconButton from '../button/IconButton.svelte';
  import DropdownItem from '../dropdown/DropdownItem.svelte';
  import DropdownMenu from '../dropdown/DropdownMenu.svelte';
  import Flair from '../misc/Flair.svelte';
  import Icon from '../misc/Icon.svelte';
  import Modal from '../modal/Modal.svelte';
  import ModalBody from '../modal/ModalBody.svelte';
  import ModalFooter from '../modal/ModalFooter.svelte';
  import ModalHeader from '../modal/ModalHeader.svelte';

  let {
    class: className,
    self,
    post,
    detail = false,
    compact = false,
    parent = false,
    hideReplyMark = false,
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

  let reaction = $derived(post.reaction);
  let reactionCount = $derived(post.reactionCount);
  let imageIndex = $state<number>(0);
  let showModal = $state<'delete' | null>(null);

  onMount(() => {
    const main = document.getElementById(`post-${post.id}`) as HTMLElement;
    if (!detail) {
      main.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement;
        if (target.closest('.ignore-click')) return;
        ev.preventDefault();
        window.location.href = `/post/${post.id}`;
      });
    }
  });

  function hideModal() {
    showModal = null;
  }
</script>

<div
  class={[
    'flex p-4',
    compact ? 'gap-2' : 'gap-4',
    !detail && 'cursor-pointer hover:bg-gray-900/40',
    className,
  ]}
  id="post-{post.id}"
>
  <img
    class="profile-picture-sm ignore-click"
    src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class={['flex flex-col', compact ? 'gap-3' : 'gap-6']}>
    <div class="flex flex-col">
      {#if !detail && !hideReplyMark && isReply}
        <span class="text-xs text-gray-500">
          replied to {post.parentPost?.owner.displayName}
        </span>
      {/if}

      <div class="ignore-click flex items-baseline gap-2 text-gray-500">
        <a
          class="text-xl text-white decoration-white hover:underline"
          href="/user/{post.owner.username}"
        >
          {post.owner.displayName}
        </a>
        <span class="text-gray-500">@{post.owner.username}</span>

        <span>-</span>
        <span>{getTimeAgo(Date.parse(post.dateCreated))}</span>
        {#if post.dateUpdated}
          <span>-</span>
          <span>edited {getTimeAgo(Date.parse(post.dateUpdated))}</span>
        {/if}
      </div>
    </div>

    {#if post.tag}
      <Flair class="ignore-click" tag={post.tag} />
    {/if}

    {#if compact}
      <p class="ignore-click line-clamp-2 whitespace-pre-line">{post.content}</p>
    {:else}
      <span class="ignore-click whitespace-pre-line">{post.content}</span>
    {/if}

    {#if post.mediaPaths.length > 0}
      {#if isImages}
        <div class="ignore-click relative min-w-1/2">
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
            alt="post-{post.id}-image-{imageIndex}"
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
        <video class="ignore-click w-full min-w-1/2 rounded-lg" controls>
          <source src={post.mediaPaths[0]} type="video/mp4" />
        </video>
      {/if}
    {/if}

    <!-- reactions -->
    {#if !parent}
      <div class="ignore-click flex w-fit gap-6">
        <form
          action="?/react"
          method="post"
          use:enhance={() => {
            return async ({ result, update }) => {
              await formResultToast(result, toaster, undefined, false);
              await update({ reset: false });
            };
          }}
        >
          <input type="text" name="reaction" value={reaction} hidden readonly />
          <input type="number" name="post-id" value={post.id} hidden readonly />

          <DropdownMenu position="top" align="left" horizontal>
            {#snippet trigger()}
              <div class="react-button flex gap-2">
                <Icon
                  type={(reaction ?? 'noReaction') as keyof typeof reactions}
                  class={[reaction !== null && reactions[reaction as keyof typeof reactions]]}
                  size="sm"
                />
                {reactionCount}
              </div>
            {/snippet}

            {#each Object.entries(reactions) as [type, color]}
              <DropdownItem
                class="reaction-button"
                noHover
                onclick={() => {
                  if (reaction === type) {
                    reaction = null;
                    reactionCount--;
                  } else {
                    if (!reaction) reactionCount++;
                    reaction = type;
                  }
                }}
              >
                <Icon type={type as keyof typeof reactions} class={color} size="sm" hover />
              </DropdownItem>
            {/each}
          </DropdownMenu>
        </form>

        <div class="flex items-center gap-2">
          <Icon type="reply" size="sm" />
          {post.replyCount}
        </div>
      </div>
    {/if}
  </div>

  <!-- option menu -->
  {#if !parent}
    <DropdownMenu class="ignore-click ml-auto h-fit" position="bottom" align="right">
      {#snippet trigger()}
        <IconButton class="hover:bg-gray-800" round>
          <Icon type="menu" size="sm" />
        </IconButton>
      {/snippet}

      {#if detail && self.id === post.owner.id}
        <DropdownItem>Edit</DropdownItem>
      {/if}
      {#if self.role === 'admin' || self.id === post.owner.id}
        <DropdownItem class="text-red-500" onclick={() => (showModal = 'delete')}
          >Delete</DropdownItem
        >
      {/if}
    </DropdownMenu>
  {/if}
</div>

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
  <ModalHeader>Delete post</ModalHeader>
  <ModalBody>Are you sure you want to delete this post? This is irreversible.</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/delete-post"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
      <input type="text" name="post-id" value={post.id} hidden readonly />
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<!--
@component
Post component: shows OP, content, interaction counts...  
Reaction requires `?/react` formaction
-->

<style lang="postcss">
  @reference '@/app.css';

  img,
  video {
    cursor: initial;
  }
</style>

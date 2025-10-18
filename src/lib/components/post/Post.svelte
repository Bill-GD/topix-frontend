<script lang="ts">
  import { enhance } from '$app/forms';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast, getTimeAgo, tooltip } from '$lib/utils/helpers';
  import type { CurrentUser, Post } from '$lib/utils/types';
  import type { ClassValue } from 'svelte/elements';
  import Button from '../button/Button.svelte';
  import IconButton from '../button/IconButton.svelte';
  import DropdownItem from '../dropdown/DropdownItem.svelte';
  import DropdownMenu from '../dropdown/DropdownMenu.svelte';
  import Flair from '../misc/Flair.svelte';
  import Icon from '../misc/Icon.svelte';
  import VisibilitySelector from '../misc/VisibilitySelector.svelte';
  import Modal from '../modal/Modal.svelte';
  import ModalBody from '../modal/ModalBody.svelte';
  import ModalFooter from '../modal/ModalFooter.svelte';
  import ModalHeader from '../modal/ModalHeader.svelte';
  import ImageCarousel from './ImageCarousel.svelte';

  let {
    class: className,
    self,
    post,
    detail = false,
    hideReaction = false,
    hideOptions = false,
    hideReplyMark = false,
    showThreadAndGroupName = false,
    allowEditVisibility = false,
  }: {
    class?: ClassValue;
    self: CurrentUser;
    post: Post;
    detail?: boolean;
    hideReaction?: boolean;
    hideOptions?: boolean;
    hideReplyMark?: boolean;
    showThreadAndGroupName?: boolean;
    allowEditVisibility?: boolean;
  } = $props();

  const toaster = getToaster();
  const isImages = $derived(post.mediaPaths.every((m) => m.includes('image')));
  const isVideo = $derived(post.mediaPaths.every((m) => m.includes('video')));
  const canClickPost = $derived(
    !detail &&
      (post.visibility === 'public' ||
        (post.visibility === 'private' && self.id === post.owner.id)),
  );
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
  let showModal = $state<'delete' | 'visibility' | null>(null);
  let hasExtraInfo = $derived(
    isReply || (showThreadAndGroupName && (post.groupName || post.threadTitle)),
  );

  function hideModal() {
    showModal = null;
  }
</script>

<article
  class={[
    'relative flex flex-col gap-4 box',
    canClickPost && 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80',
    className,
  ]}
>
  {#if !detail}
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <a class="absolute inset-0" href="/post/{post.id}"></a>
  {/if}

  <div class="flex items-center gap-3">
    <img
      class="profile-picture-sm"
      src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
      alt="profile"
    />
    <div class="flex flex-col">
      <div class="flex items-center gap-2 text-sm">
        {#if !detail && !hideReplyMark && isReply}
          <span class="line-clamp-1 w-max text-gray-500">
            replied to {post.parentPost?.owner.displayName}
          </span>
        {/if}

        {#if showThreadAndGroupName}
          {#if post.threadTitle}
            <a
              class="line-clamp-1 w-fit font-semibold overflow-ellipsis hover:underline"
              href="/threads/{post.threadId}"
            >
              {post.threadTitle}
            </a>
          {:else if post.groupName}
            <a
              class="line-clamp-1 w-fit font-semibold overflow-ellipsis hover:underline"
              href="/groups/{post.groupId}"
            >
              {post.groupName}
            </a>
          {/if}
        {/if}
      </div>

      <div class="flex w-fit items-center gap-2 text-gray-500">
        <a
          class="z-1 font-semibold text-black hover:underline dark:text-white dark:decoration-white"
          href="/user/{post.owner.username}"
        >
          {post.owner.displayName}
        </a>
        {#if hasExtraInfo}
          •
          <span>{getTimeAgo(Date.parse(post.dateCreated))}</span>
          {#if post.dateUpdated}
            •
            <span>edited {getTimeAgo(Date.parse(post.dateUpdated))}</span>
          {/if}
          {#if post.visibility !== 'public'}
            •
            {#if post.visibility === 'private'}
              <Icon class="z-1" {@attach tooltip('Private')} type="lock" size="xs" />
            {:else if post.visibility === 'hidden'}
              <Icon class="z-1" {@attach tooltip('Hidden')} type="eyeSlash" size="xs" />
            {/if}
          {/if}
        {/if}
      </div>

      {#if !hasExtraInfo}
        <div class="flex w-fit items-center gap-2 text-gray-500">
          <span>{getTimeAgo(Date.parse(post.dateCreated))}</span>
          {#if post.dateUpdated}
            •
            <span>edited {getTimeAgo(Date.parse(post.dateUpdated))}</span>
          {/if}
          {#if post.visibility !== 'public'}
            •
            {#if post.visibility === 'private'}
              <Icon class="z-1" {@attach tooltip('Private')} type="lock" size="xs" />
            {:else if post.visibility === 'hidden'}
              <Icon class="z-1" {@attach tooltip('Hidden')} type="eyeSlash" size="xs" />
            {/if}
          {/if}
        </div>
      {/if}
    </div>

    {#if !hideOptions && (self.id === post.owner.id || self.role === 'admin')}
      <DropdownMenu class="ml-auto" position="bottom" align="right">
        {#snippet trigger()}
          <IconButton class="p-2" round>
            <Icon type="menu" size="xs" />
          </IconButton>
        {/snippet}

        {#if detail && self.id === post.owner.id && allowEditVisibility}
          <DropdownItem onclick={() => (showModal = 'visibility')}>Edit</DropdownItem>
        {/if}
        {#if self.role === 'admin' || self.id === post.owner.id}
          <DropdownItem class="text-red-500" onclick={() => (showModal = 'delete')}>
            Delete
          </DropdownItem>
        {/if}
      </DropdownMenu>
    {/if}
  </div>

  <!-- post content -->
  <div class="flex flex-col gap-4">
    {#if post.tag}
      <Flair tag={post.tag} compact />
    {/if}

    {#if post.visibility !== 'public' && self.id !== post.owner.id}
      <span>Post is privated or hidden.</span>
    {:else}
      {#if post.content.length > 0}
        {#if detail}
          <span class="whitespace-pre-line">{post.content}</span>
        {:else}
          <p class="line-clamp-2 whitespace-pre-line">{post.content}</p>
        {/if}
      {/if}

      {#if post.mediaPaths.length > 0}
        {#if isImages}
          <ImageCarousel images={post.mediaPaths} />
        {/if}

        {#if isVideo}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video class="w-full min-w-1/2 rounded-lg" controls>
            <source src={post.mediaPaths[0]} type="video/mp4" />
          </video>
        {/if}
      {/if}
    {/if}
  </div>

  <!-- reactions -->
  {#if !hideReaction}
    <div class="flex gap-4">
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
            <div
              class="z-1 flex cursor-pointer items-center gap-2 rounded-md bg-zinc-200 p-2 hover:bg-zinc-300 dark:bg-zinc-600
dark:hover:bg-zinc-500"
            >
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

      <a
        class="z-1 flex items-center gap-2 rounded-md bg-zinc-200 p-2 hover:bg-zinc-300 dark:bg-zinc-600
dark:hover:bg-zinc-500"
        href={detail ? null : `/post/${post.id}`}
      >
        <Icon type="reply" size="sm" />
        {post.replyCount}
      </a>
    </div>
  {/if}
</article>

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
          await update({ reset: false });
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
      <input type="text" name="post-id" value={post.id} hidden readonly />
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal show={showModal === 'visibility'} backdropCallback={hideModal} center>
  <ModalHeader>Change post visibility</ModalHeader>
  <form
    class="flex w-full flex-col gap-4"
    action="?/update-post-visibility"
    method="post"
    use:enhance={() => {
      return async ({ result, update }) => {
        await formResultToast(result, toaster);
        await update({ reset: false });
      };
    }}
  >
    <VisibilitySelector visibility={post.visibility} />

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

<!--
@component
Post component: shows OP, content, interaction counts...  
Reaction requires `?/react` formaction
-->

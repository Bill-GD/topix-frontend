<script lang="ts">
  import { onMount } from 'svelte';
  import { getTimeAgo } from '../utils/helpers';
  import DropdownItem from './DropdownItem.svelte';
  import DropdownMenu from './DropdownMenu.svelte';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import Link from './Link.svelte';
  import type { PostProps } from './types';

  let { class: className, self, content, post, detail = false }: PostProps = $props();

  const isImages = post.mediaPaths.every((m) => m.includes('image'));
  const isVideo = post.mediaPaths.every((m) => m.includes('video'));
  let imageIndex = $state<number>(0);

  onMount(() => {
    const main = document.getElementById(`post-${post.id}`) as HTMLElement;
    if (!detail) {
      main.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement;
        if (
          target.closest('video') ||
          target.closest('img') ||
          target.closest('svg') ||
          target.closest('button') ||
          target.closest('.dropdown-menu') ||
          target.closest('.reaction-button')
        ) {
          return;
        }

        ev.preventDefault();
        window.location.href = `/post/${post.id}`;
      });
    }
  });
</script>

<div
  class={['main', !detail && 'cursor-pointer hover:bg-gray-900/40', className]}
  id="post-{post.id}"
>
  <img
    class="profile-picture-sm"
    src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class="flex flex-col gap-6">
    <div class="flex items-baseline gap-4">
      <Link class="flex items-baseline gap-2" href="/user/{post.owner.username}">
        <span class="text-xl text-white decoration-white hover:underline">
          {post.owner.displayName}
        </span>
        <span class="text-gray-500">@{post.owner.username}</span>
      </Link>
      <span class="text-gray-500">-</span>
      <span class="text-gray-500">
        {getTimeAgo(Date.parse(post.dateCreated))}
      </span>
    </div>

    {@render content?.()}

    {#if post.mediaPaths.length > 0}
      {#if isImages}
        <div class="relative w-fit min-w-1/2">
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

    <div class="flex gap-6">
      <div class="flex items-center gap-2">
        {post.reactionCount}
        <Icon type="like" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        {post.replyCount}
        <Icon type="reply" size="sm" />
      </div>
    </div>
  </div>

  <DropdownMenu class="ml-auto h-fit" position="bottom" align="end" origin="tr">
    {#snippet trigger()}
      <IconButton class="p-2 hover:bg-gray-800">
        <Icon type="menu" size="sm" />
      </IconButton>
    {/snippet}

    {#if self.username === post.owner.username}
      <DropdownItem href="#">Edit</DropdownItem>
    {/if}
    {#if self.role === 'admin' || self.username === post.owner.username}
      <DropdownItem href="#">Delete</DropdownItem>
    {/if}
  </DropdownMenu>
</div>

<style lang="postcss">
  @reference '@/app.css';

  .main {
    @apply flex gap-4 p-4;
  }

  .main {
    img,
    video {
      cursor: default;
    }
  }
</style>

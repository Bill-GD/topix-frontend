<script lang="ts">
  import DropdownItem from './DropdownItem.svelte';
  import DropdownMenu from './DropdownMenu.svelte';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import Link from './Link.svelte';
  import type { PostProps } from './types';

  let { username, owner, content, post }: PostProps = $props();

  const isImages = post.mediaPaths.every((m) => m.includes('image'));
  const isVideo = post.mediaPaths.every((m) => m.includes('video'));
</script>

<a class="main" href="/post/{post.id}" data-sveltekit-preload-data="tap">
  <img
    class="profile-picture-sm"
    src={owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class="flex w-full flex-col gap-6">
    <div class="flex items-baseline gap-4">
      <Link class="flex items-baseline gap-2" href="/user/{owner.username}">
        <span class="text-xl text-white">{owner.displayName}</span>
        <span class="text-sm text-gray-500">@{owner.username}</span>
      </Link>
      <span class="text-sm text-gray-500">{post.dateCreated}</span>
    </div>

    {@render content?.()}

    {#if post.mediaPaths.length > 0}
      <div class="flex w-full gap-4">
        {#if isImages}
          {#each post.mediaPaths as url, index (index)}
            <img class="min-w-1/2 rounded-lg" src={url} alt="post-image-{index}" />
          {/each}
        {/if}

        {#if isVideo}
          <!-- svelte-ignore a11y_media_has_caption -->
          <video class="w-full min-w-1/2 rounded-lg" controls>
            <source src={post.mediaPaths[0]} type="video/mp4" />
          </video>
        {/if}
      </div>
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

  <DropdownMenu class="ml-auto" position="bottom" align="end" origin="tr">
    {#snippet trigger()}
      <IconButton
        class="cursor-pointer p-2 hover:bg-gray-800"
        onclick={(ev) => ev.preventDefault()}
      >
        <Icon type="menu" size="sm" />
      </IconButton>
    {/snippet}

    <DropdownItem href="#">Edit</DropdownItem>
    {#if username === owner.username}
      <DropdownItem href="#">Delete</DropdownItem>
    {/if}
  </DropdownMenu>
</a>

<style lang="postcss">
  @reference '@/app.css';

  .main {
    @apply flex gap-4 border-gray-700 p-4 hover:bg-gray-900/40;
  }
</style>

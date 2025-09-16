<script lang="ts">
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
  const wrapper = detail ? 'div' : 'a';
</script>

<svelte:element
  this={wrapper}
  class={['main', wrapper === 'a' && 'hover:bg-gray-900/40', className]}
  href={wrapper === 'a' ? `/post/${post.id}` : ''}
  data-sveltekit-preload-data="tap"
>
  <img
    class="profile-picture-sm"
    src={post.owner.profilePicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class="flex w-full flex-col gap-6">
    <div class="flex items-baseline gap-4">
      <Link class="flex items-baseline gap-2" href="/user/{post.owner.username}">
        <span class="text-xl text-white">{post.owner.displayName}</span>
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
        <div class="relative w-fit">
          {#if imageIndex > 0}
            <IconButton
              class="absolute top-1/2 left-0 h-full -translate-y-1/2 hover:bg-gray-900/20"
              round={false}
              onclick={(ev) => {
                ev.preventDefault();
                imageIndex = Math.max(0, imageIndex - 1);
              }}
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
              onclick={(ev) => {
                ev.preventDefault();
                imageIndex = Math.min(post.mediaPaths.length - 1, imageIndex + 1);
              }}
            >
              <Icon type="next" size="sm" />
            </IconButton>
          {/if}
        </div>
      {/if}

      {#if isVideo}
        <!-- svelte-ignore a11y_media_has_caption -->
        <video class={['w-full rounded-lg', wrapper === 'a' && 'min-w-1/2']} controls>
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

  <DropdownMenu class="ml-auto" position="bottom" align="end" origin="tr">
    {#snippet trigger()}
      <IconButton
        class="cursor-pointer p-2 hover:bg-gray-800"
        onclick={(ev) => ev.preventDefault()}
      >
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
</svelte:element>

<style lang="postcss">
  @reference '@/app.css';

  .main {
    @apply flex gap-4 p-4;
  }
</style>

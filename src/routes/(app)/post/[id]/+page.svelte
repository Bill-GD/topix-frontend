<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from './$types';
  import { Link, Icon, DropdownMenu, IconButton, DropdownItem } from '@/lib/components';
  import { getTimeAgo } from '@/lib/utils/helpers';

  let { data, form }: PageProps = $props();

  const isImages = data.post.mediaPaths.every((m) => m.includes('image'));
  const isVideo = data.post.mediaPaths.every((m) => m.includes('video'));
  let imageIndex = $state<number>(0);
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="post-container">
    <div class="flex items-center gap-4">
      <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" size="sm" />
      </IconButton>
      <span class="text-lg font-semibold">Post</span>
    </div>

    <div class="post">
      <div class="flex gap-4">
        <img
          class="profile-picture-sm"
          src={data.self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />

        <div class="flex items-baseline gap-4">
          <Link class="flex items-baseline gap-2" href="/user/{data.self.username}">
            <span class="text-xl text-white">{data.self.displayName}</span>
            <span class="text-gray-500">@{data.self.username}</span>
          </Link>
          <span class="text-gray-500">-</span>
          <span class="text-gray-500">
            {getTimeAgo(Date.parse(data.post.dateCreated))}
          </span>
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
          {#if data.self.username === data.self.username}
            <DropdownItem href="#">Delete</DropdownItem>
          {/if}
        </DropdownMenu>
      </div>

      <div class="flex w-full flex-col gap-6">
        {data.post.content}

        {#if data.post.mediaPaths.length > 0}
          {#if isImages}
            <div class="relative w-fit">
              {#if imageIndex > 0}
                <IconButton
                  class="absolute top-1/2 left-0 h-full -translate-y-1/2 hover:bg-gray-900/20"
                  onclick={() => (imageIndex = Math.max(0, imageIndex - 1))}
                >
                  <Icon type="back" size="sm" />
                </IconButton>
              {/if}

              <img
                class="w-full rounded-lg"
                src={data.post.mediaPaths[imageIndex]}
                alt="post-image-{imageIndex}"
              />

              <div class="absolute bottom-1 left-1/2 z-2 flex -translate-x-1/2 gap-1">
                {#each data.post.mediaPaths as _, index}
                  <span
                    class={[
                      'h-2 w-2 rounded-full border border-white',
                      index === imageIndex && 'bg-white',
                    ]}
                  ></span>
                {/each}
              </div>

              {#if imageIndex < data.post.mediaPaths.length - 1}
                <IconButton
                  class="absolute top-1/2 right-0 h-full -translate-y-1/2 hover:bg-gray-900/20"
                  onclick={() =>
                    (imageIndex = Math.min(data.post.mediaPaths.length - 1, imageIndex + 1))}
                >
                  <Icon type="next" size="sm" />
                </IconButton>
              {/if}
            </div>
          {/if}

          {#if isVideo}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video class="w-full rounded-lg" controls>
              <source src={data.post.mediaPaths![0]} type="video/mp4" />
            </video>
          {/if}
        {/if}

        <div class="flex gap-6">
          <div class="flex items-center gap-2">
            {data.post.reactionCount}
            <Icon type="like" size="sm" />
          </div>
          <div class="flex items-center gap-2">
            {data.post.replyCount}
            <Icon type="reply" size="sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .post-container {
    @apply flex flex-col gap-4 border-b border-gray-700 p-4;
  }

  .post {
    @apply flex flex-col gap-4;
  }
</style>

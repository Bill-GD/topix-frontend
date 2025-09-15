<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from './$types';
  import { Link, Icon, DropdownMenu, IconButton, DropdownItem } from '@/lib/components';

  let { data, form }: PageProps = $props();

  const isImages = data.post.mediaPaths![0].includes('image');
  const isVideo = data.post.mediaPaths![0].includes('video') && data.post.mediaPaths!.length === 1;
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

        <div class="flex items-center gap-4">
          <Link class="flex items-baseline gap-2" href="/user/{data.self.username}">
            <span class="text-xl text-white">{data.self.displayName}</span>
            <span class="text-sm text-gray-500">@{data.self.username}</span>
          </Link>
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

        <div class="flex w-full gap-4">
          {#if isImages}
            {#each data.post.mediaPaths! as url, index (index)}
              <img class="w-full rounded-lg" src={url} alt="post-image-{index}" />
            {/each}
          {/if}

          {#if isVideo}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video class="w-full rounded-lg" controls>
              <source src={data.post.mediaPaths![0]} type="video/mp4" />
            </video>
          {/if}
        </div>

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

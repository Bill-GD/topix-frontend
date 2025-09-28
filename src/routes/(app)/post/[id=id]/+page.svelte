<script lang="ts">
  import { IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const isReply = data.post.parentPost !== undefined;
</script>

<svelte:head>
  <title>Post by {data.post.owner.displayName} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="post-container">
    <div class="flex items-center gap-4 px-4">
      <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" size="sm" />
      </IconButton>
      <span class="text-lg font-semibold">{isReply ? 'Reply' : 'Post'}</span>
    </div>

    {#if isReply}
      <Post self={data.self} post={data.post.parentPost!} compact parent />
    {/if}

    {#if isReply}
      <div class="flex gap-2">
        <div class="px-4"></div>
        <Post class="w-full" self={data.self} post={data.post} detail />
      </div>
    {:else}
      <Post self={data.self} post={data.post} detail />
    {/if}
  </div>

  <PostUpload
    userPicture={data.self.profilePicture}
    formaction="?/reply"
    placeholder="Enter your reply"
  />

  <hr class="text-gray-700" />
  {#each data.replies as reply}
    <Post self={data.self} post={reply} compact hideReplyMark />
    <hr class="text-gray-700" />
  {/each}
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .post-container {
    @apply flex flex-col border-b border-gray-700 pt-4;
  }
</style>

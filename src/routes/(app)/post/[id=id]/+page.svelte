<script lang="ts">
  import { IconButton } from '$lib/components/button';
  import { HomeLayout } from '$lib/components/layout';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const isReply = data.post.parentPost !== undefined;
</script>

<svelte:head>
  <title>Post by {data.post.owner.displayName} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="flex flex-col border-b border-gray-700">
    <ReturnHeader>{isReply ? 'Reply' : 'Post'}</ReturnHeader>

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
    groupId={data.post.groupId ?? undefined}
    groupApproved
  />

  <hr class="text-gray-700" />
  {#each data.replies as reply}
    <Post self={data.self} post={reply} compact hideReplyMark />
    <hr class="text-gray-700" />
  {/each}
</HomeLayout>

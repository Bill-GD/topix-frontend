<script lang="ts">
  import { ReturnHeader } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const isReply = data.post.parentPost !== undefined;
</script>

<svelte:head>
  <title>Post by {data.post.owner.displayName} - topix</title>
</svelte:head>

<div class="flex flex-col">
  <ReturnHeader>{isReply ? 'Reply' : 'Post'}</ReturnHeader>

  {#if isReply}
    <Post
      class="w-full"
      self={data.self}
      post={data.post.parentPost!}
      hideReaction
      hideOptions
      showThreadAndGroupName
    />

    <div class="h-4 w-fit self-center border-2 border-zinc-500"></div>
  {/if}

  <Post
    class="mb-4 w-full"
    self={data.self}
    post={data.post}
    detail
    showThreadAndGroupName={!isReply}
    allowEditVisibility={data.post.threadId === null && data.post.groupId === null}
  />
</div>

<PostUpload
  class="mb-4"
  userPicture={data.self.profilePicture}
  formaction="?/reply"
  placeholder="Enter your reply"
  threadId={data.post.threadId ?? undefined}
  groupId={data.post.groupId ?? undefined}
  groupApproved
/>

<div class="flex flex-col gap-4">
  {#each data.replies as reply}
    <Post self={data.self} post={reply} hideReplyMark />
  {/each}
</div>

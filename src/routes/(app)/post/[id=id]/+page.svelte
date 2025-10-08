<script lang="ts">
  import { HomeLayout } from '$lib/components/layout';
  import { Divider, ReturnHeader } from '$lib/components/misc';
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
        <Post
          class="w-full"
          self={data.self}
          post={data.post}
          detail
          allowEditVisibility={data.post.threadId === null && data.post.groupId === null}
        />
      </div>
    {:else}
      <Post
        self={data.self}
        post={data.post}
        detail
        allowEditVisibility={data.post.threadId === null && data.post.groupId === null}
      />
    {/if}
  </div>

  <PostUpload
    userPicture={data.self.profilePicture}
    formaction="?/reply"
    placeholder="Enter your reply"
    threadId={data.post.threadId ?? undefined}
    groupId={data.post.groupId ?? undefined}
    groupApproved
  />

  <Divider />
  {#each data.replies as reply}
    <Post self={data.self} post={reply} compact hideReplyMark />
    <Divider />
  {/each}
</HomeLayout>

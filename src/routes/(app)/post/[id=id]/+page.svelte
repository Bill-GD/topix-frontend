<script lang="ts">
  import { page } from '$app/state';
  import { IconButton } from '$lib/components/button';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { ImageCarousel, Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import { fade } from 'svelte/transition';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const isReply = $derived(data.post.parentPost !== undefined);
  const viewImage = $derived(page.url.searchParams.has('view-image'));
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

    <div class="ml-4 h-4 w-fit border-1 border-zinc-500"></div>
  {/if}

  <div class="flex">
    {#if isReply}
      <div
        class="ml-4 h-1/2 w-[6%] rounded-bl-lg border-b-2 border-l-2 border-zinc-500 text-transparent md:w-[4%]"
      >
        '
      </div>
    {/if}
    <Post
      class={['mb-4 w-full', isReply && 'w-5/6']}
      self={data.self}
      post={data.post}
      detail
      showThreadAndGroupName={!isReply}
      allowEditVisibility={data.post.threadId === null && data.post.groupId === null}
    />
  </div>
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

{#if viewImage}
  <div class={['fixed inset-0 z-8 flex backdrop-blur-xl']} transition:fade={{ duration: 250 }}>
    <a class="z-9 h-screen" href="/post/{data.post.id}" data-sveltekit-replacestate>
      <IconButton class="absolute top-4 right-4 z-9 p-2">
        <Icon type="close" />
      </IconButton>
    </a>
    <ImageCarousel
      images={data.post.mediaPaths}
      imageClass="max-h-screen px-4 rounded-md"
      transparentBackground
    />
  </div>
{/if}

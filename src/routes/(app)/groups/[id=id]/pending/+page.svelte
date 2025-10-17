<script lang="ts">
  import { Scroller } from '$lib/components/layout';
  import { Divider, ReturnHeader } from '$lib/components/misc';
  import { PendingPost } from '$lib/components/post';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let posts = $derived(data.posts);
</script>

<svelte:head>
  <title>Pending posts | {data.group.name} - topix</title>
</svelte:head>

<ReturnHeader>Pending posts</ReturnHeader>

<div class="flex flex-col">
  {#if data.posts.length <= 0}
    <p class="empty-noti-text">No pending posts.</p>
  {:else}
    {#each posts as post}
      <PendingPost {post} />
      <Divider />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/posts?groupId=${data.group.id}&accepted=false&page=${++pageIndex}`,
        );
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        posts = [...posts, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/if}
</div>

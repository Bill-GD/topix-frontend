<script lang="ts">
  import { Scroller } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { PendingPost } from '$lib/components/post';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let pageIndex = 1;
  let disableScroller = $derived<boolean>(data.endOfList);
  let posts = $derived(data.posts);
</script>

<svelte:head>
  <title>Pending posts | {data.group.name} - topix</title>
</svelte:head>

<ReturnHeader>Pending posts</ReturnHeader>

<div class="flex flex-col gap-4">
  {#if data.posts.length <= 0}
    <p class="empty-noti-text">No pending posts.</p>
  {:else}
    {#each posts as post}
      <PendingPost {post} />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/posts?groupId=${data.group.id}&threadId=null&accepted=false&page=${++pageIndex}`,
        );
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        posts = [...posts, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
      }}
    />
  {/if}
</div>

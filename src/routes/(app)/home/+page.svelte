<script lang="ts">
  import { page } from '$app/state';
  import { Scroller } from '$lib/components/layout';
  import { Tab, TabBar } from '$lib/components/link';
  import { Post } from '$lib/components/post';
  import { capitalize } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const items = ['new', 'following'];
  const tab = $derived(page.url.searchParams.get('tab') ?? 'new') as 'new' | 'following';
  let pageIndex = 1;
  let disableScroller = $derived({
    new: data.endOfList,
    following: data.endOfList,
  });
  let posts = $derived(data.posts);
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<div class="mx-2 mt-4 flex flex-col gap-4 md:mx-0">
  <TabBar>
    {#each items as item}
      <Tab href="?tab={item}" selected={tab === item}>{capitalize(item)}</Tab>
    {/each}
  </TabBar>

  {#if tab === 'new'}
    {#each posts as post (post.id)}
      <Post self={data.self} {post} showThreadAndGroupName />
    {/each}
  {:else if tab === 'following'}
    {#if data.posts!.length <= 0}
      <p class="empty-noti-text">You haven't follow anyone or thread.</p>
    {:else}
      {#each posts as post (post.id)}
        <Post self={data.self} {post} showThreadAndGroupName />
      {/each}
    {/if}
  {/if}

  {#key tab}
    <Scroller
      disabled={disableScroller[tab]}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/posts?page=${++pageIndex}${tab === 'following' ? '&following' : ''}`,
        );
        const newData = await res.json();
        disableScroller[tab] = res.headers.get('x-end-of-list') === 'true';
        posts = [...posts, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller[tab] = data.endOfList;
      }}
    />
  {/key}
</div>

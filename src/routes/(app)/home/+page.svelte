<script lang="ts">
  import { page } from '$app/state';
  import { HomeLayout, Scroller } from '$lib/components/layout';
  import { Divider } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { ThreadOverview } from '$lib/components/thread';
  import { capitalize } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const tab = $derived(page.url.searchParams.get('tab') ?? 'new');
  const items = $derived(['new', 'following']);
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let posts = $derived(data.posts);
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div
    class="no-scrollbar sticky top-0 z-[2] flex overflow-x-scroll border-b border-gray-400 bg-zinc-50 dark:border-gray-700 dark:bg-zinc-950"
  >
    {#each items as item}
      <a
        class={[
          'flex-1 px-4 py-2 text-center',
          tab === item
            ? 'bg-zinc-300/40 font-semibold dark:bg-zinc-800/40 dark:text-gray-300'
            : 'text-gray-500',
        ]}
        href="?tab={item}"
        data-sveltekit-replacestate
      >
        {capitalize(item)}
      </a>
    {/each}
  </div>

  <div class="mx-2 mt-4 flex flex-col gap-4 md:mx-0">
    {#if tab === 'new'}
      {#each posts as post (post.id)}
        <Post self={data.self} {post} />
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
  </div>

  {#key tab}
    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/posts?page=${++pageIndex}${tab === 'following' ? '&following' : ''}`,
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
  {/key}

  {#snippet right()}
    {#if tab === 'new'}
      <div class="rounded-md border border-gray-700">
        <div class="flex items-baseline p-4">
          <p class="text-xl font-semibold">Newly updated threads</p>
        </div>

        {#each data.threads as thread}
          <Divider />
          <ThreadOverview {thread} showOwner />
        {/each}
      </div>
    {/if}
  {/snippet}
</HomeLayout>

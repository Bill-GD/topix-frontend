<script lang="ts">
  import { page } from '$app/state';
  import { HomeLayout, Scroller } from '$lib/components/layout';
  import { Divider } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { ThreadOverview } from '$lib/components/thread';
  import { capitalize } from '$lib/utils/helpers';
  import type { Attachment } from 'svelte/attachments';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const tab = $derived(page.url.searchParams.get('tab') ?? 'new');
  const items = $derived(['new', 'following']);
  let pageIndex = 1;
  let isFetching = $state<boolean>(false);
  let disableScroller = $state<boolean>(false);
  let posts = $derived(data.posts);

  function scrollerAttachment(following: boolean = false): Attachment {
    return (node) => {
      const observer = new IntersectionObserver(async (entries, observer) => {
        if (disableScroller) return;
        if (!entries[0].isIntersecting) return;

        isFetching = true;
        const res = await fetch(`/api/posts?page=${++pageIndex}${following ? '&following' : ''}`);
        const newPosts = await res.json();
        if (newPosts.length <= 0) disableScroller = true;
        posts = [...posts, ...newPosts];
        isFetching = false;
      });

      observer.observe(node);

      return () => {
        pageIndex = 1;
        disableScroller = false;
        observer.disconnect();
      };
    };
  }
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div
    class="no-scrollbar sticky top-0 z-10 flex overflow-x-scroll border-b border-gray-400 bg-gray-100 dark:border-gray-700 dark:bg-gray-950"
  >
    {#each items as item}
      <a
        class={[
          'flex-1 px-4 py-2 text-center',
          tab === item
            ? 'bg-gray-300/40 font-semibold dark:bg-gray-800/40 dark:text-gray-300'
            : 'text-gray-500',
        ]}
        href="?tab={item}"
        data-sveltekit-replacestate
      >
        {capitalize(item)}
      </a>
    {/each}
  </div>

  {#if tab === 'new'}
    {#each posts as post (post.id)}
      <Post self={data.self} {post} />
      <Divider />
    {/each}
  {:else if tab === 'following'}
    {#if posts!.length <= 0}
      <p class="empty-noti-text">You haven't follow anyone or thread.</p>
    {:else}
      {#each posts as post (post.id)}
        <Post self={data.self} {post} showThreadAndGroupName />
        <Divider />
      {/each}
    {/if}
  {/if}

  <Scroller {@attach scrollerAttachment(tab === 'following')} disabled={disableScroller}>
    {#if isFetching}
      Loading more...
    {:else if disableScroller}
      No more posts.
    {:else}
      Load more.
    {/if}
  </Scroller>

  {#snippet right()}
    {#if tab === 'new'}
      <div class="rounded-md border border-gray-700 2xl:max-w-1/2">
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

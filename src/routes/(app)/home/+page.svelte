<script lang="ts">
  import { page } from '$app/state';
  import { HomeLayout } from '$lib/components/layout';
  import { Divider } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { ThreadOverview } from '$lib/components/thread';
  import { capitalize } from '@/lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const tab = $derived(page.url.searchParams.get('tab') ?? 'new');
  const items = $derived(['new', 'following']);
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
    {#each data.posts as post (post.id)}
      <Post self={data.self} {post} />
      <Divider />
    {/each}
  {:else if tab === 'following'}
    {#if data.posts!.length <= 0}
      <p class="empty-noti-text">You haven't follow anyone or thread.</p>
    {:else}
      {#each data.posts as post (post.id)}
        <Post self={data.self} {post} showThreadAndGroupName />
        <Divider />
      {/each}
    {/if}
  {/if}

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

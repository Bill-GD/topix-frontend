<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { getFeedSearchParams } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let searchString = $derived<string>(decodeURIComponent(page.url.searchParams.get('q') ?? ''));
  let posts = $derived(data.posts);
  let searched = $derived<boolean>(page.url.searchParams.has('q'));
  let disableScroller = $derived(data.endOfList);
  let pageIndex = 1;
</script>

<svelte:head>
  <title>Search - topix</title>
</svelte:head>

<ReturnHeader>Search</ReturnHeader>
<div class="flex flex-col gap-4">
  <form
    class="relative"
    method="post"
    onsubmit={(ev) => {
      ev.preventDefault();
      goto(`?q=${encodeURIComponent(searchString)}`, { replaceState: true });
    }}
  >
    <Input
      name="search-string"
      bind:value={searchString}
      list="search-options"
      clearable
      placeholder="Search posts"
    >
      {#snippet prefixIcon()}
        <Icon class="text-zinc-500" type="search" size="sm" />
      {/snippet}
    </Input>

    <datalist id="search-options">
      <option value="from:">Search by post owner name.</option>
      <option value="media:">
        Search by inclusion of image or video. Accepts true or false.
      </option>
    </datalist>
  </form>

  {#if !searched}
    <p class="notice-text">Search for any post on topix.</p>
  {:else if posts.length <= 0}
    <p class="notice-text">No result found.</p>
  {:else}
    {#each posts as post (post.id)}
      <Post self={data.self} {post} showThreadAndGroupName />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/posts?${getFeedSearchParams(searchString)}&page=${++pageIndex}`,
        );
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        posts = [...posts, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/if}
</div>

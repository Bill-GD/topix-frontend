<script lang="ts">
  import { enhance } from '$app/forms';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast, getFeedSearchParams } from '$lib/utils/helpers';
  import type { Post as PostType } from '$lib/utils/types';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  const toaster = getToaster();
  let inputValue = $state<string>('');
  let posts = $derived(form?.posts ?? []);
  let searched = $state<boolean>(false);
  let disableScroller = $derived(form?.endOfList ?? false);
  let pageIndex = 1;
</script>

<svelte:head>
  <title>Search - topix</title>
</svelte:head>

<div class="mt-4 flex flex-col gap-4">
  <form
    class="relative"
    method="post"
    use:enhance={() => {
      return async ({ result, update }) => {
        await update();

        if (result.type === 'success') {
          const formResult = result.data as {
            posts: PostType[];
            endOfList: boolean;
            searchString: string;
          };
          posts = formResult.posts;
          inputValue = formResult.searchString;
          searched = true;
        } else {
          await formResultToast(result, toaster);
        }
      };
    }}
  >
    <Input
      name="search-string"
      bind:value={inputValue}
      list="search-options"
      clearable
      placeholder="Search topix"
    >
      {#snippet prefixIcon()}
        <Icon class="text-zinc-500" type="search" size="sm" />
      {/snippet}
    </Input>

    <datalist id="search-options">
      <option value="from:">Search by post owner.</option>
      <!-- <option value="in:"></option> -->
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
        const [params, finalSearchString] = getFeedSearchParams(inputValue);
        if (finalSearchString.length <= 0) {
          disableScroller = true;
          posts = [];
          return;
        }

        const res = await fetch(`/api/posts?${params}&page=${++pageIndex}`);
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

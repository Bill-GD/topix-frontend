<script lang="ts">
  import { IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { HomeLayout } from '$lib/components/layout';
  import { PendingPost } from '$lib/components/post';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Pending posts | {data.group.name} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="sticky top-0 border-r border-b border-gray-700 bg-gray-950 py-4 text-center text-2xl">
    <div class="relative">
      <IconButton class="absolute left-4 hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" />
      </IconButton>
    </div>
    Pending posts
  </div>

  <div class="flex flex-col">
    {#if data.posts.length <= 0}
      <p class="w-full p-4 text-center text-2xl font-semibold">No pending posts.</p>
    {/if}
    {#each data.posts as post}
      <PendingPost {post} />
      <hr class="text-gray-700" />
    {/each}
  </div>
</HomeLayout>

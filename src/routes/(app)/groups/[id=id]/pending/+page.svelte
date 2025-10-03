<script lang="ts">
  import { HomeLayout } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { PendingPost } from '$lib/components/post';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Pending posts | {data.group.name} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <ReturnHeader>Pending posts</ReturnHeader>

  <div class="flex flex-col">
    {#if data.posts.length <= 0}
      <p class="empty-noti-text">No pending posts.</p>
    {/if}
    {#each data.posts as post}
      <PendingPost {post} />
      <hr class="text-gray-700" />
    {/each}
  </div>
</HomeLayout>

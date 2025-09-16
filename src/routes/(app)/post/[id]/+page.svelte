<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from './$types';
  import { Icon, IconButton, Post } from '@/lib/components';

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="post-container">
    <div class="flex items-center gap-4 px-4">
      <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" size="sm" />
      </IconButton>
      <span class="text-lg font-semibold">Post</span>
    </div>

    <Post self={data.self} post={data.post} detail>
      {#snippet content()}
        {data.post.content}
      {/snippet}
    </Post>
  </div>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .post-container {
    @apply flex flex-col border-b border-gray-700 pt-4;
  }
</style>

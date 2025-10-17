<script lang="ts">
  import { Tab, TabBar } from '$lib/components/link';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { ThreadOverview } from '$lib/components/overview';
  import { Post } from '$lib/components/post';
  import { capitalize } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const items = ['post', 'thread', 'group'];
</script>

<svelte:head>
  <title>Hidden items - topix</title>
</svelte:head>

<ReturnHeader>Hidden items</ReturnHeader>

<div class="flex flex-col gap-4">
  <TabBar>
    {#each items as item}
      <Tab href={item} selected={params.section === item}>{capitalize(item)}</Tab>
    {/each}
  </TabBar>

  {#if params.section === 'post'}
    {#if data.posts!.length <= 0}
      <p class="empty-noti-text">No hidden post.</p>
    {/if}
    {#each data.posts! as post (post.id)}
      <Post self={data.self} {post} />
    {/each}
  {:else if params.section === 'thread'}
    {#if data.threads!.length <= 0}
      <p class="empty-noti-text">No hidden thread.</p>
    {/if}
    {#each data.threads! as thread (thread.id)}
      <ThreadOverview {thread} />
    {/each}
  {:else if params.section === 'group'}
    {#if data.groups!.length <= 0}
      <p class="empty-noti-text">No hidden group.</p>
    {/if}
    {#each data.groups! as group (group.id)}
      <a
        class="flex items-center gap-4 p-4 hover:bg-zinc-300/40 dark:hover:bg-zinc-900/40"
        href="/groups/{group.id}"
      >
        <div class="w-30 overflow-hidden rounded-md">
          <img src={group.bannerPicture ?? '/images/no-image.jpg'} alt="group-banner" />
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">{group.name}</span>
          <div class="flex items-baseline gap-2 text-gray-500">
            {#if group.visibility === 'private'}
              <Icon type="lock" size="xs" />
            {:else if group.visibility === 'hidden'}
              <Icon type="eyeSlash" size="xs" />
            {/if}
            {capitalize(group.visibility)}
            -
            {group.memberCount} member{group.memberCount > 1 ? 's' : ''}
          </div>
          <p>Owner: {group.owner.displayName}</p>
        </div>

        {#if group.status !== null}
          <div class={['ml-auto font-semibold', group.status ? 'text-green-700' : 'text-sky-500']}>
            {group.status ? 'Joined' : 'Pending'}
          </div>
        {/if}
      </a>
    {/each}
  {/if}
</div>

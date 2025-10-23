<script lang="ts">
  import { Scroller } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { getTimeAgo } from '@/lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let channels = $derived(data.channels);
  let pageIndex = 1;
  let disableScroller = $derived(data.endOfList);
  let others = $derived(
    data.channels.map((c) => {
      return data.self.id === c.firstUser.id ? c.secondUser : c.firstUser;
    }),
  );
</script>

<svelte:head>
  <title>Chat - topix</title>
</svelte:head>

<ReturnHeader>Chat</ReturnHeader>

{#if channels.length <= 0}
  <p class="notice-text">You have no chat channel yet.</p>
{:else}
  <div class="flex flex-col gap-4">
    {#each channels as channel, index (channel.id)}
      <!-- <p>{channel.id}: {channel.firstUser.username} - {channel.secondUser.username}</p> -->
      <a
        class="flex items-center gap-4 box p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
        href="/chat/{channel.id}"
      >
        <img
          class="profile-picture-sm md:profile-picture-md md:p-2"
          src={others[index].profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col gap-2">
          <span class="font-semibold">{others[index].displayName}</span>
          <span class="text-zinc-400">{channel.lastMessage ?? 'No message'}</span>
        </div>
        <span class="mr-2 ml-auto text-zinc-400">
          {getTimeAgo(Date.parse(channel.lastSentAt ?? channel.dateCreated))}
        </span>
      </a>
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(`/api/chat?page=${++pageIndex}`);
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        channels = [...channels!, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  </div>
{/if}

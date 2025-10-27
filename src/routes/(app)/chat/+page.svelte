<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Badge, Icon, ReturnHeader } from '$lib/components/misc';
  import { getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let channels = $derived(data.channels);
  let pageIndex = 1;
  let disableScroller = $derived(data.endOfList);
  let searchString = $derived<string>(decodeURIComponent(page.url.searchParams.get('q') ?? ''));
  let searched = $derived<boolean>(page.url.searchParams.has('q'));
  let others = $derived(
    data.channels.map((c) => {
      return data.self.id === c.firstUser?.id ? c.secondUser : c.firstUser;
    }),
  );
</script>

<svelte:head>
  <title>Chat - topix</title>
</svelte:head>

<ReturnHeader>Chat</ReturnHeader>

<div class="flex flex-col gap-4">
  <form
    class="relative"
    method="post"
    onsubmit={(ev) => {
      ev.preventDefault();
      goto(`?q=${encodeURIComponent(searchString)}`, { replaceState: true });
    }}
  >
    <Input name="search-string" bind:value={searchString} clearable placeholder="Search by name">
      {#snippet prefixIcon()}
        <Icon class="text-zinc-500" type="search" size="sm" />
      {/snippet}
    </Input>
  </form>

  {#if searched}
    <Button
      class="w-fit"
      type="dark"
      outline
      onclick={() => {
        goto(`/chat`, { replaceState: true });
      }}
    >
      Clear result
    </Button>
  {/if}

  {#if channels.length <= 0}
    <p class="notice-text">
      {#if searched}
        No result found.
      {:else}
        You have no chat channel yet.
      {/if}
    </p>
  {:else}
    {#each channels as channel, index (channel.id)}
      <a
        class="flex items-center gap-4 box p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
        href="/chat/{channel.id}"
      >
        <img
          class="profile-picture-sm md:profile-picture-md md:p-2"
          src={others[index]?.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col gap-2">
          <span class="line-clamp-1 font-semibold overflow-ellipsis">
            {others[index]?.displayName ?? '[Deleted user]'}
          </span>
          <span class="line-clamp-1 overflow-ellipsis text-zinc-400">
            {channel.lastMessage ?? 'No message'}
          </span>
        </div>
        <div class="mr-2 ml-auto flex items-center gap-2">
          {#if channel.newMessageCount > 0}
            <Badge text={channel.newMessageCount > 99 ? '99+' : `${channel.newMessageCount}`} />
          {/if}
          <span class="text-zinc-400">
            {getTimeAgo(Date.parse(channel.lastSentAt ?? channel.dateCreated))}
          </span>
        </div>
      </a>
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/chat?page=${++pageIndex}${searchString ? `&username=${searchString}` : ''}`,
        );
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        channels = [...channels!, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/if}
</div>

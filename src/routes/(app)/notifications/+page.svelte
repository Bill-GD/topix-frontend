<script lang="ts">
  import { Scroller } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { formatNotification, getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let notifications = $derived(data.notifications.map(formatNotification));
  let pageIndex = 1;
  let disableScroller = $state<boolean>(data.endOfList);
</script>

<svelte:head>
  <title>Notifications - topix</title>
</svelte:head>

<ReturnHeader>Notifications</ReturnHeader>

<div class="flex flex-col gap-4">
  {#if notifications.length <= 0}
    <p class="notice-text">You have no notification.</p>
  {:else}
    {#each notifications as noti}
      <a
        class="flex items-center gap-4 box hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
        href={noti.url}
      >
        <img
          class="profile-picture-xs sm:profile-picture-sm"
          src={noti.actor.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col">
          <div class="line-clamp-1 overflow-ellipsis">
            <span class="font-bold">{noti.actor.displayName}</span>
            {#if noti.actorCount > 1}
              <span>and {noti.actorCount - 1} other</span>
            {/if}
            {@html noti.action}
            {#if noti.actionType === 'react'}
              {#if noti.postContent}
                <span>: "{noti.postContent}"</span>
              {:else}
                .
              {/if}
            {:else if noti.actionType === 'update_thread'}
              <span>: "{noti.threadTitle}"</span>
            {/if}
          </div>
          {getTimeAgo(Date.parse(noti.dateCreated))}
        </div>
      </a>
    {/each}

    <Scroller
      disabled={disableScroller}
      hideText={notifications.length <= 0}
      attachmentCallback={async () => {
        const res = await fetch(`/api/notifications?page=${++pageIndex}`);
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        notifications = [...notifications, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/if}
</div>

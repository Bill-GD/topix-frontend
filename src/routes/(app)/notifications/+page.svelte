<script lang="ts">
  import { Scroller } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { getTimeAgo } from '$lib/utils/helpers';
  import type { NotificationTypes } from '$lib/utils/types';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let notifications = $derived(data.notifications);
  let pageIndex = 1;
  let disableScroller = $state<boolean>(data.endOfList);

  function getAction(type: NotificationTypes) {
    switch (type) {
      case 'react':
        return 'reacted to your <b>post</b>.';
      case 'update_thread':
        return 'updated their thread.';
      case 'follow':
        return 'followed you.';
    }
  }

  function getLink(type: NotificationTypes, actorUsername: string, objectId: number) {
    switch (type) {
      case 'react':
        return `/post/${objectId}`;
      case 'update_thread':
        return `/threads/${objectId}`;
      case 'follow':
        return `/user/${actorUsername}`;
    }
  }
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
        href={getLink(noti.type, noti.actor.username, noti.objectId)}
      >
        <img
          class="profile-picture-xs sm:profile-picture-sm"
          src={noti.actor.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col">
          <div>
            <span class="font-bold">{noti.actor.displayName}</span>
            {#if noti.actorCount > 1}
              <span>and {noti.actorCount - 1} other</span>
            {/if}
            {@html getAction(noti.type)}
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

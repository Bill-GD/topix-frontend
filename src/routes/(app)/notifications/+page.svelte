<script lang="ts">
  import { ReturnHeader } from '$lib/components/misc';
  import type { NotificationTypes } from '$lib/utils/types';
  import { getTimeAgo } from '@/lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

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

  function getLink(type: NotificationTypes, actorUsername: string, objectId: number | null) {
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
  {#each data.notifications as noti}
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
          {@html getAction(noti.type)}
        </div>
        {getTimeAgo(Date.parse(noti.dateCreated))}
      </div>
    </a>
  {/each}
</div>

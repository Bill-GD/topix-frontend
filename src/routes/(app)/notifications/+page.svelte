<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { formatNotification, formResultToast, getTimeAgo } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let notifications = $derived(data.notifications.map(formatNotification));
  let pageIndex = 1;
  let disableScroller = $state<boolean>(data.endOfList);
  let showModal = $state<boolean>(false);
  let selectedNotiId = $state<string>('');

  function hideModal() {
    showModal = false;
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
      <div class="relative">
        <a class="absolute inset-0 z-0" href={noti.url} aria-label="link"></a>
        <div class="flex items-center gap-4 box box-hover">
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
          <Button
            class="z-1 ml-auto p-2 dark:hover:bg-zinc-700"
            onclick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              showModal = true;
              selectedNotiId = noti.id;
            }}
          >
            <Icon type="delete" class="text-red-500" />
          </Button>
        </div>
      </div>
    {/each}

    <Scroller
      disabled={disableScroller}
      hideText={notifications.length <= 0}
      attachmentCallback={async () => {
        const res = await fetch(`/api/notifications?page=${++pageIndex}`);
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        notifications = [...notifications, ...newData.map(formatNotification)];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/if}
</div>

<Modal show={showModal} backdropCallback={hideModal} center>
  <ModalHeader>Delete notification</ModalHeader>
  <ModalBody>Are you sure you want to delete this notification?</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/delete-notification"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
      <input type="text" name="noti-id" value={selectedNotiId} hidden readonly />
    </form>
    <Button class="w-full" type="base" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

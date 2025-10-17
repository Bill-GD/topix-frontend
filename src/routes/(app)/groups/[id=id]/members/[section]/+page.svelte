<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { Scroller } from '$lib/components/layout';
  import { Tab, TabBar } from '$lib/components/link';
  import { ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const toaster = getToaster();
  const items = ['all', 'pending'];
  let showModal = $state<'remove' | 'owner' | null>(null);
  let selectedMemberId = $state<number>(0);
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let members = $derived(data.members);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Members | {data.group.name} - topix</title>
</svelte:head>

<ReturnHeader>Members</ReturnHeader>

<div class="flex flex-col gap-4">
  <TabBar>
    {#each items as item}
      <Tab href={item} selected={params.section === item}>
        {capitalize(item)}
      </Tab>
    {/each}
  </TabBar>

  {#if params.section === 'all'}
    {#each members as user}
      <a
        class="flex flex-col gap-4 box hover:bg-zinc-100 md:flex-row dark:hover:bg-zinc-800/80"
        href="/user/{user.username}"
      >
        <div class="flex items-center gap-4">
          <img
            class="profile-picture-md"
            src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
            alt="profile"
          />
          <div class="flex flex-col gap-2">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-semibold">{user.displayName}</span>
              <span class="text-gray-500">@{user.username}</span>
            </div>
            <p>Joined at {new Date(user.dateJoined!).toDateString()}</p>
          </div>
        </div>

        {#if data.self.id === data.group.owner.id && user.id !== data.group.owner.id}
          <div class="flex items-center justify-center gap-2 md:ml-auto">
            <Button
              class="z-1 w-full md:w-fit"
              type="primary"
              onclick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                selectedMemberId = user.id;
                showModal = 'owner';
              }}
            >
              Change owner
            </Button>
            <Button
              class="z-1 w-full md:w-fit"
              type="danger"
              onclick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                selectedMemberId = user.id;
                showModal = 'remove';
              }}
            >
              Remove
            </Button>
          </div>
        {/if}
      </a>
    {/each}
  {:else if params.section === 'pending'}
    {#if data.members.length <= 0}
      <p class="empty-noti-text">No pending members.</p>
    {:else}
      {#each members as user}
        <a
          class="flex flex-col gap-4 box hover:bg-zinc-100 md:flex-row dark:hover:bg-zinc-900/40"
          href="/user/{user.username}"
        >
          <div class="flex items-center gap-4">
            <img
              class="profile-picture-md"
              src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
              alt="profile"
            />
            <div class="flex flex-col gap-2">
              <div class="flex items-baseline gap-2">
                <span class="text-xl font-semibold">{user.displayName}</span>
                <span class="text-gray-500">@{user.username}</span>
              </div>
              <p>Requested at {new Date(user.dateRequested).toDateString()}</p>
            </div>
          </div>

          {#if data.self.id === data.group.owner.id}
            <form
              class="flex items-center gap-2 md:ml-auto"
              action="?/accept-member"
              method="post"
              use:enhance={() => {
                return async ({ result, update }) => {
                  await formResultToast(result, toaster);
                  await update();
                };
              }}
            >
              <input type="number" name="member-id" value={selectedMemberId} hidden readonly />
              <Button
                class="w-full md:w-fit"
                type="success"
                onclick={() => (selectedMemberId = user.id)}
              >
                Accept
              </Button>
              <Button
                class="w-full md:w-fit"
                type="danger"
                onclick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  selectedMemberId = user.id;
                  showModal = 'remove';
                }}
              >
                Remove
              </Button>
            </form>
          {/if}
        </a>
      {/each}
    {/if}
  {/if}

  {#key params.section}
    <Scroller
      hideText
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/groups?id=${data.group.id}&members&accepted=${params.section === 'all'}&page=${++pageIndex}`,
        );
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        members = [...members, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/key}
</div>

<Modal show={showModal === 'owner'} backdropCallback={hideModal} center>
  <ModalHeader>Change ownership</ModalHeader>
  <ModalBody>
    Are you sure you want to appoint this member as the owner? You will nullify all your rights as
    an owner.
  </ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/change-owner"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <input type="number" name="member-id" value={selectedMemberId} hidden readonly />
      <Button class="w-full" type="primary" onclick={hideModal}>Change</Button>
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal show={showModal === 'remove'} backdropCallback={hideModal} center>
  <ModalHeader>Remove member</ModalHeader>
  <ModalBody>Are you sure you want to remove this member?</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/remove-member"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <input type="number" name="member-id" value={selectedMemberId} hidden readonly />
      <Button class="w-full" type="danger" onclick={hideModal}>Remove</Button>
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

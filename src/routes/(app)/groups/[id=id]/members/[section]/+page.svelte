<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { HomeLayout } from '$lib/components/layout';
  import { Divider, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const toaster = getToaster();
  const items = ['all', 'pending'];
  let showModal = $state<'remove' | 'owner' | null>(null);
  let selectedMemberId = $state<number>(0);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Members | {data.group.name} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <ReturnHeader>Members</ReturnHeader>

  <div
    class="no-scrollbar flex justify-around overflow-x-scroll border-b border-gray-400 md:hidden dark:border-gray-700"
  >
    {#each items as item}
      <a
        class={[
          'w-full py-2 text-center',
          params.section === item
            ? `bg-gray-300/40 font-semibold dark:bg-gray-800/40 ${item.includes('danger') ? 'text-red-600' : 'dark:text-gray-300'}`
            : `${item.includes('danger') ? 'text-red-800' : 'text-gray-500'}`,
        ]}
        href={item}
      >
        {capitalize(item)}
      </a>
    {/each}
  </div>

  <div class="flex flex-col">
    {#if params.section === 'all'}
      {#each data.members as user}
        <div
          class="flex flex-col gap-2 p-4 hover:bg-gray-300/40 md:flex-row dark:hover:bg-gray-900/40"
        >
          <div class="flex items-center gap-4">
            <img
              class="profile-picture-md"
              src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
              alt="profile"
            />
            <div class="flex flex-col gap-2">
              <a class="flex items-baseline gap-2" href="/user/{user.username}">
                <span class="text-xl font-semibold">{user.displayName}</span>
                <span class="text-gray-500">@{user.username}</span>
              </a>
              <p>Joined at {new Date(user.dateJoined!).toDateString()}</p>
            </div>
          </div>
          {#if data.self.id === data.group.owner.id && user.id !== data.group.owner.id}
            <div class="flex items-center justify-center gap-2 md:ml-auto">
              <Button
                class="w-full md:w-fit"
                type="primary"
                onclick={() => {
                  selectedMemberId = user.id;
                  showModal = 'owner';
                }}
              >
                Change owner
              </Button>
              <Button
                class="w-full md:w-fit"
                type="danger"
                onclick={() => {
                  selectedMemberId = user.id;
                  showModal = 'remove';
                }}
              >
                Remove
              </Button>
            </div>
          {/if}
        </div>
        <Divider />
      {/each}
    {:else if params.section === 'pending'}
      {#if data.members.length <= 0}
        <p class="empty-noti-text">No pending members.</p>
      {/if}
      {#each data.members as user}
        <div
          class="flex flex-col gap-2 p-4 hover:bg-gray-300/40 md:flex-row dark:hover:bg-gray-900/40"
        >
          <div class="flex items-center gap-4">
            <img
              class="profile-picture-md"
              src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
              alt="profile"
            />
            <div class="flex flex-col gap-2">
              <a class="flex items-baseline gap-2" href="/user/{user.username}">
                <span class="text-xl font-semibold">{user.displayName}</span>
                <span class="text-gray-500">@{user.username}</span>
              </a>
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
                  selectedMemberId = user.id;
                  showModal = 'remove';
                }}
              >
                Remove
              </Button>
            </form>
          {/if}
        </div>
        <Divider />
      {/each}
    {/if}
  </div>

  {#snippet right()}
    <div class="flex w-fit flex-col py-20 text-xl">
      {#each items as item, index}
        <div class="flex">
          <div
            class={[
              params.section === item
                ? 'border-gray-700 dark:border-gray-300'
                : 'border-gray-300 dark:border-gray-700',
              index === 0 && 'rounded-t-md',
              index === items.length - 1 && 'rounded-b-md',
              'mr-4 w-0 border-l-6',
            ]}
          ></div>
          <a
            class={[
              'py-2',
              params.section === item ? 'font-semibold dark:text-gray-300' : 'text-gray-500',
            ]}
            href={item}
          >
            {capitalize(item)}
          </a>
        </div>
      {/each}
    </div>
  {/snippet}

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
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .input-group {
    @apply flex flex-col items-start gap-2;
  }
</style>

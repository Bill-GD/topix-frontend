<script lang="ts">
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import { IconButton, Button } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { HomeLayout } from '$lib/components/layout';
  import { getToaster } from '$lib/components/toast';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from '$lib/components/modal';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data, params }: PageProps = $props();

  const toaster = getToaster();
  const items = ['all', 'pending'];
  let showRemoveModal = $state<boolean>(false);
  let showOwnerModal = $state<boolean>(false);
  let selectedMemberId = $state<number>(0);
</script>

<svelte:head>
  <title>Members | {data.group.name} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="sticky-header">
    <div class="relative">
      <IconButton class="absolute left-4 hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" />
      </IconButton>
    </div>
    Members
  </div>

  <div
    class="no-scrollbar flex justify-around overflow-x-scroll border-b border-gray-700 md:hidden"
  >
    {#each items as item}
      <a
        class={[
          'w-full py-2 text-center',
          params.section === item
            ? `bg-gray-800/40 font-semibold ${item.includes('danger') ? 'text-red-600' : 'text-gray-300'}`
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
        <div class="flex items-center gap-4 p-4 hover:bg-gray-900/40">
          <img
            class="profile-picture-md"
            src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
            alt="profile"
          />
          <div class="flex flex-col gap-2">
            <a
              class="flex items-baseline gap-2"
              href="/user/{user.username}"
              data-sveltekit-preload-data="tap"
            >
              <span class="text-xl font-semibold">{user.displayName}</span>
              <span class="text-gray-500">@{user.username}</span>
            </a>
            <p>Joined at {new Date(user.dateJoined!).toDateString()}</p>
          </div>
          {#if data.self.username === data.group.owner.username && user.username !== data.group.owner.username}
            <Button
              class="ml-auto w-fit"
              type="primary"
              onclick={() => {
                selectedMemberId = user.id;
                showOwnerModal = true;
              }}
            >
              Change owner
            </Button>
            <Button
              class="w-fit"
              type="danger"
              onclick={() => {
                selectedMemberId = user.id;
                showRemoveModal = true;
              }}
            >
              Remove
            </Button>
          {/if}
        </div>
        <hr class="text-gray-700" />
      {/each}
    {:else if params.section === 'pending'}
      {#if data.members.length <= 0}
        <p class="w-full p-4 text-center text-2xl font-semibold">No pending members.</p>
      {/if}
      {#each data.members as user}
        <div class="flex items-center gap-4 p-4 hover:bg-gray-900/40">
          <img
            class="profile-picture-md"
            src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
            alt="profile"
          />
          <div class="flex flex-col gap-2">
            <a
              class="flex items-baseline gap-2"
              href="/user/{user.username}"
              data-sveltekit-preload-data="tap"
            >
              <span class="text-xl font-semibold">{user.displayName}</span>
              <span class="text-gray-500">@{user.username}</span>
            </a>
            <p>Requested at {new Date(user.dateRequested).toDateString()}</p>
          </div>

          {#if data.self.username === data.group.owner.username}
            <form
              class="ml-auto flex gap-2"
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
                class="ml-auto w-fit"
                type="success"
                onclick={() => (selectedMemberId = user.id)}
              >
                Accept
              </Button>
              <Button
                class="ml-auto w-fit"
                type="danger"
                onclick={(ev) => {
                  ev.preventDefault();
                  selectedMemberId = user.id;
                  showRemoveModal = true;
                }}
              >
                Remove
              </Button>
            </form>
          {/if}
        </div>
        <hr class="text-gray-700" />
      {/each}
    {/if}
  </div>

  {#snippet right()}
    <div class="flex w-fit flex-col py-20 text-xl">
      {#each items as item, index}
        <div class="flex">
          <div
            class={[
              params.section === item ? 'border-gray-300' : 'border-gray-700',
              index === 0 && 'rounded-t-md',
              index === items.length - 1 && 'rounded-b-md',
              'mr-4 w-0 border-l-6',
            ]}
          ></div>
          <a
            class={[
              'py-2',
              params.section === item
                ? `font-semibold ${item.includes('danger') ? 'text-red-600' : 'text-gray-300'}`
                : `${item.includes('danger') ? 'text-red-800' : 'text-gray-500'}`,
            ]}
            href={item}
          >
            {capitalize(item)}
          </a>
        </div>
      {/each}
    </div>
  {/snippet}

  <Modal bind:show={showOwnerModal} center>
    <ModalHeader>Change ownership</ModalHeader>
    <ModalBody>
      Are you sure you want to appoint this member as the owner? You will nullify all your rights as
      an owner.
    </ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        method="post"
        action="?/change-owner"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <input type="number" name="member-id" value={selectedMemberId} hidden readonly />
        <Button class="w-full" type="primary" onclick={() => (showOwnerModal = false)}>
          Change
        </Button>
      </form>
      <Button class="w-full" type="dark" onclick={() => (showOwnerModal = false)}>Cancel</Button>
    </ModalFooter>
  </Modal>

  <Modal bind:show={showRemoveModal} center>
    <ModalHeader>Remove member</ModalHeader>
    <ModalBody>Are you sure you want to remove this member?</ModalBody>
    <ModalFooter>
      <form
        class="w-full"
        method="post"
        action="?/remove-member"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <input type="number" name="member-id" value={selectedMemberId} hidden readonly />
        <Button class="w-full" type="danger" onclick={() => (showRemoveModal = false)}>
          Remove
        </Button>
      </form>
      <Button class="w-full" type="dark" onclick={() => (showRemoveModal = false)}>Cancel</Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .sticky-header {
    @apply sticky top-0 border-r border-b border-gray-700 bg-gray-950 py-4 text-center text-2xl;
  }

  .input-group {
    @apply flex flex-col items-start gap-2;
  }
</style>

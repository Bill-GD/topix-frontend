<script lang="ts">
  import { HomeLayout } from '$lib/components/layout';
  import { Button, IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { getToaster } from '$lib/components/toast';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import { Modal, ModalHeader, ModalBody } from '$lib/components/modal';
  import { FloatingLabelInput } from '$lib/components/input';
  import { FileDropzone } from '$lib/components/upload';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<boolean>(false);
  let groupName = $state<string>('');
  let bannerValue = $state<string>('');
  let filenameValue = $state<string>('');
</script>

<svelte:head>
  <title>Groups - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="border-b border-gray-700 py-4 text-center text-xl font-semibold">Groups</div>

  <div class="flex flex-col">
    {#if data.groups.length <= 0}
      <p class="p-4 text-center text-xl font-semibold">
        There are no group available in topix yet.
      </p>
    {:else}
      {#each data.groups as group}
        <a
          class="flex items-center gap-4 p-4 hover:bg-gray-900/40"
          href="/groups/{group.id}"
          data-sveltekit-preload-data="tap"
        >
          <div class="w-30 overflow-hidden rounded-md">
            <img src={group.bannerPicture ?? '/images/no-image.jpg'} alt="group-banner" />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-baseline gap-2 text-gray-500">
              <span class="text-xl font-semibold text-white">{group.name}</span>
              <span>-</span>
              <span>{capitalize(group.visibility)}</span>
              <span>-</span>
              <span>{group.memberCount} member{group.memberCount > 1 ? 's' : ''}</span>
            </div>
            <p>Owner: {group.owner.displayName}</p>
          </div>

          <div class="ml-auto flex items-center justify-end gap-2">
            <Button class="hover:bg-gray-800" type="primary" disabled={group.joined}>
              {group.joined ? 'Joined' : 'Join'}
            </Button>
          </div>
        </a>
        <hr class="text-gray-700" />
      {/each}
    {/if}
  </div>

  {#snippet right()}
    <IconButton
      class="flex gap-2 hover:bg-gray-800"
      variant="success"
      onclick={() => (showModal = true)}
    >
      <span class="font-semibold">Create group</span>
      <Icon type="add" size="sm" />
    </IconButton>
  {/snippet}

  <Modal class="mx-4 w-full md:m-0 md:w-1/2" id="modal-create-group" bind:show={showModal} center>
    <ModalHeader>Create new group</ModalHeader>
    <ModalBody>
      <form
        action="?/create-group"
        method="post"
        class="flex w-full flex-col items-center gap-4"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <FloatingLabelInput
          class="w-full"
          labelClass="bg-gray-900"
          name="group-name"
          bind:value={groupName}
          required
        >
          Name
        </FloatingLabelInput>

        {#if bannerValue !== ''}
          <img class="rounded-md" src={bannerValue} alt="user-profile" />
        {/if}

        <FileDropzone
          contentInputName="group-banner"
          bind:contentValue={bannerValue}
          filenameInputName="group-banner-name"
          bind:filenameValue
        />

        <div class="flex w-full flex-col gap-2 md:flex-row">
          <Button
            class="w-full"
            type="success"
            onclick={() => (showModal = false)}
            disabled={groupName === ''}>Create</Button
          >
          <Button class="w-full" type="dark" onclick={() => (showModal = false)}>Cancel</Button>
        </div>
      </form>
    </ModalBody>
  </Modal>
</HomeLayout>

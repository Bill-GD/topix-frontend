<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { HomeLayout } from '$lib/components/layout';
  import { Divider, Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { FileDropzone } from '$lib/components/upload';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'create' | null>(null);
  let groupName = $state<string>('');
  let bannerValue = $state<string>('');

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Groups - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <ReturnHeader>Groups</ReturnHeader>

  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="flex w-full cursor-pointer items-center justify-center gap-2 py-4 hover:bg-gray-300/40 dark:hover:bg-gray-800/40"
    onclick={() => (showModal = 'create')}
  >
    <span class="font-semibold">Create group</span>
    <Icon type="add" size="sm" />
  </div>

  <div class="flex flex-col">
    {#if data.groups.length <= 0}
      <p class="p-4 text-center text-xl font-semibold">
        There are no group available in topix yet.
      </p>
    {:else}
      <Divider />
      {#each data.groups as group}
        <a
          class="flex items-center gap-4 p-4 hover:bg-gray-300/40 dark:hover:bg-gray-900/40"
          href="/groups/{group.id}"
        >
          <div class="w-30 overflow-hidden rounded-md">
            <img src={group.bannerPicture ?? '/images/no-image.jpg'} alt="group-banner" />
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-xl font-semibold">{group.name}</span>
            <div class="flex items-baseline gap-2 text-gray-500">
              {#if group.visibility === 'private'}
                <Icon type="lock" size="xs" />
              {:else if group.visibility === 'hidden'}
                <Icon type="eyeSlash" size="xs" />
              {/if}
              {capitalize(group.visibility)}
              -
              {group.memberCount} member{group.memberCount > 1 ? 's' : ''}
            </div>
            <p>Owner: {group.owner.displayName}</p>
          </div>

          {#if group.status !== null}
            <div
              class={['ml-auto font-semibold', group.status ? 'text-green-700' : 'text-sky-500']}
            >
              {group.status ? 'Joined' : 'Pending'}
            </div>
          {/if}
        </a>
        <Divider />
      {/each}
    {/if}
  </div>

  <Modal show={showModal === 'create'} backdropCallback={hideModal} center>
    <ModalHeader>Create new group</ModalHeader>
    <ModalBody>
      <form
        class="flex w-full flex-col items-center gap-4"
        action="?/create-group"
        method="post"
        use:enhance={() => {
          return async ({ result, update }) => {
            await formResultToast(result, toaster);
            await update();
          };
        }}
      >
        <FloatingLabelInput
          class="w-full"
          labelClass="bg-gray-200 dark:bg-gray-900"
          name="group-name"
          bind:value={groupName}
          required
        >
          Name
        </FloatingLabelInput>

        {#if bannerValue !== ''}
          <img class="rounded-md" src={bannerValue} alt="user-profile" />
        {/if}

        <FileDropzone contentInputName="group-banner" bind:contentValue={bannerValue} />

        <div class="flex w-full flex-col gap-2 md:flex-row">
          <Button class="w-full" type="success" onclick={hideModal} disabled={groupName === ''}
            >Create</Button
          >
          <Button
            class="w-full"
            type="dark"
            onclick={(ev) => {
              ev.preventDefault();
              hideModal();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </ModalBody>
  </Modal>
</HomeLayout>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput, Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader, VisibilitySelector } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { GroupOverview } from '$lib/components/overview';
  import { getToaster } from '$lib/components/toast';
  import { FileDropzone } from '$lib/components/upload';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'create' | null>(null);
  let groupName = $state<string>('');
  let bannerValue = $state<string>('');
  let searchString = $derived<string>(decodeURIComponent(page.url.searchParams.get('q') ?? ''));
  let searched = $derived<boolean>(page.url.searchParams.has('q'));
  let pageIndex = 1;
  let disableScroller = $derived<boolean>(data.endOfList);
  let groups = $derived(data.groups);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Groups - topix</title>
</svelte:head>

<ReturnHeader>Groups</ReturnHeader>

<div class="flex flex-col gap-4">
  <form
    class="relative"
    method="post"
    onsubmit={(ev) => {
      ev.preventDefault();
      goto(`?q=${encodeURIComponent(searchString)}`, { replaceState: true });
    }}
  >
    <Input
      name="search-string"
      bind:value={searchString}
      clearable
      placeholder="Search by group name"
    >
      {#snippet prefixIcon()}
        <Icon class="text-zinc-500" type="search" size="sm" />
      {/snippet}
    </Input>
  </form>

  <div class="flex justify-end">
    {#if searched}
      <Button
        class="mr-auto"
        type="dark"
        outline
        onclick={() => {
          goto(`/groups`, { replaceState: true });
        }}
      >
        Clear result
      </Button>
    {/if}
    <Button
      class="flex w-fit items-center gap-2"
      type="success"
      onclick={() => (showModal = 'create')}
    >
      Create group
      <Icon type="add" size="sm" />
    </Button>
  </div>

  {#if groups.length <= 0}
    {#if searched}
      <p class="p-4 text-center text-xl font-semibold">No result found.</p>
    {:else}
      <p class="p-4 text-center text-xl font-semibold">
        There are no group available in topix yet.
      </p>
    {/if}
  {:else}
    {#each groups as group}
      <GroupOverview {group} showOwner />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/groups?page=${++pageIndex}${searched ? `&name=${searchString}` : ''}`,
        );
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        groups = [...groups, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = data.endOfList;
      }}
    />
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
        labelClass="peer-focus:bg-zinc-200 peer-focus:dark:bg-zinc-900"
        name="group-name"
        bind:value={groupName}
        required
      >
        Name
      </FloatingLabelInput>
      <VisibilitySelector class="w-full" />

      {#if bannerValue !== ''}
        <img class="rounded-md" src={bannerValue} alt="user-profile" />
      {/if}

      <FileDropzone contentInputName="group-banner" bind:contentValue={bannerValue} />

      <ModalFooter>
        <Button class="w-full" type="success" onclick={hideModal} disabled={groupName === ''}>
          Create
        </Button>
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
      </ModalFooter>
    </form>
  </ModalBody>
</Modal>

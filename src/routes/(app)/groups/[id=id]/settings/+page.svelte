<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Button, IconButton } from '$lib/components/button';
  import { FloatingLabelInput, Input } from '$lib/components/input';
  import { Tab, TabBar } from '$lib/components/link';
  import { Flair, Icon, ReturnHeader, VisibilitySelector } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { FileDropzone } from '$lib/components/upload';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { Tag } from '$lib/utils/types';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  const tab = $derived(page.url.searchParams.get('tab') ?? 'general');
  const items = ['general', 'tags'];
  let saving = $state<boolean>(false);
  let showModal = $state<'add' | 'delete' | null>(null);
  let bannerValue = $derived<string>('');
  let filenameValue = $state<string>('');
  let tagName = $state<string>('example');
  let colorValue = $state<string>('#000000');
  let selectedTag = $state<Tag | null>(null);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Settings | {data.group.name} - topix</title>
</svelte:head>

<ReturnHeader>Settings</ReturnHeader>

<TabBar class="mb-4">
  {#each items as item}
    <Tab href="?tab={item}" selected={tab === item}>
      {capitalize(item)}
    </Tab>
  {/each}
</TabBar>

{#if tab === 'general'}
  <form
    class="flex flex-col gap-4"
    action="?/update-group"
    method="post"
    onsubmit={() => (saving = true)}
    use:enhance={() => {
      return async ({ result, update }) => {
        await formResultToast(result, toaster);
        await update();
        saving = false;
        filenameValue = '';
        bannerValue = '';
      };
    }}
  >
    <Button class="ml-auto w-fit" type="success" disabled={saving}>Save</Button>
    <div class="input-group">
      <label class="text-xl" for="group-name">Name</label>
      <Input class="w-min" id="group-name" name="group-name" value={data.group.name}></Input>
    </div>

    <div class="input-group">
      <label class="text-xl" for="description">Description</label>
      <Input
        class="w-min"
        id="description"
        name="description"
        value={data.group.description ?? ''}
        placeholder="No description"
        textarea
      />
    </div>

    <div class="input-group">
      <label class="text-xl" for="group-visibility">Visibility</label>
      <VisibilitySelector name="group-visibility" visibility={data.group.visibility} />
    </div>

    <div class="input-group">
      <label class="text-xl" for="description">Banner picture</label>
      <img
        class="rounded-md"
        src={bannerValue ? bannerValue : (data.group.bannerPicture ?? '/images/no-image.jpg')}
        alt="user-profile"
      />

      <FileDropzone contentInputName="group-banner" bind:contentValue={bannerValue} />
    </div>
  </form>
{:else if tab === 'tags'}
  <div class="flex flex-col gap-4">
    <Button class="ml-auto" type="success" onclick={() => (showModal = 'add')}>Add tag</Button>

    <p class="text-lg font-semibold">Current tags</p>
    <div class="flex flex-wrap gap-4">
      {#each data.tags as tag (tag.id)}
        <div class="flex w-min items-center gap-2 box p-2">
          <Flair {tag} />
          <IconButton
            class="p-2 hover:bg-zinc-300"
            onclick={() => {
              showModal = 'delete';
              selectedTag = tag;
            }}
          >
            <Icon type="delete" class="text-red-500" size="sm" />
          </IconButton>
        </div>
      {/each}
    </div>
  </div>
{/if}

<Modal show={showModal === 'add'} backdropCallback={hideModal} center>
  <ModalHeader>Add new tag</ModalHeader>
  <ModalBody>
    <form
      class="flex flex-col items-center gap-4"
      action="?/add-tag"
      method="post"
      onsubmit={() => (saving = true)}
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
          hideModal();
          tagName = 'example';
          colorValue = '#000000';
        };
      }}
    >
      <Flair
        tag={{
          id: 0,
          name: (tagName === '' ? 'example' : tagName).toLowerCase(),
          color: colorValue.substring(1),
        }}
      />

      <div class="flex items-center gap-4">
        <FloatingLabelInput
          name="name"
          labelClass="peer-focus:bg-zinc-200 peer-focus:dark:bg-zinc-900"
          bind:value={tagName}
          clearable
        >
          Tag name
        </FloatingLabelInput>
        <input
          class="aspect-square h-full cursor-pointer rounded-md border border-gray-700"
          type="color"
          name="tag-color"
          bind:value={colorValue}
        />
      </div>

      <Button
        class="ml-auto w-full"
        type="success"
        disabled={tagName.length <= 0}
        onclick={hideModal}
      >
        Add tag
      </Button>
    </form>
  </ModalBody>
</Modal>

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
  <ModalHeader>Delete tag</ModalHeader>
  <ModalBody>Are you sure you want to delete tag <Flair tag={selectedTag!} compact />?</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/delete-tag"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <input type="text" name="tag-id" value={selectedTag?.id} hidden readonly />
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<style lang="postcss">
  @reference '@/app.css';

  .input-group {
    @apply flex flex-col items-start gap-2;
  }
</style>

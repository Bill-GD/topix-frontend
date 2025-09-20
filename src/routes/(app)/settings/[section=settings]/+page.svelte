<script lang="ts">
  import { capitalize } from '$lib/utils/helpers';
  import { IconButton, Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Icon } from '$lib/components/misc';
  import { FileDropzone } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import type { PageProps } from './$types';
  import { onMount } from 'svelte';

  let { data, form, params }: PageProps = $props();

  const items = ['account', 'profile', 'danger'];
  let passwordValue = $state<string>('');
  let profileValue = $state<string>('');
  let profileFilenameValue = $state<string>('');
  let showModal = $state<boolean>(false);

  onMount(() => {
    document.querySelector('#update-form-save')?.addEventListener('click', (ev) => {
      ev.preventDefault();
      (document.querySelector(`form#${params.section}-form`) as HTMLFormElement | null)?.submit();
    });
  });
</script>

<svelte:head>
  <title>Settings - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="sticky-header">
    <div class="relative">
      <IconButton class="absolute left-4 hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" />
      </IconButton>
    </div>
    Settings
  </div>

  <div class="p-4 lg:p-20">
    <div class="form-button">
      {#if params.section !== 'danger'}
        <Button class="mb-4 w-fit" type="success" id="update-form-save">Save</Button>
        {#if form}
          <span class={form.success ? 'text-green-500' : 'text-red-500'}>{form.message}</span>
        {/if}
      {:else if form}
        <span class={['ml-auto', form.success ? 'text-green-500' : 'text-red-500']}>
          {form.message}
        </span>
      {/if}
    </div>

    <div class="flex flex-col gap-6">
      {#if params.section === 'account'}
        <form action="?/update-account" id="account-form" method="post">
          <div class="flex flex-col gap-2">
            <label class="text-xl" for="username">Username</label>
            <Input class="w-min" id="username" name="username" value={data.self.username}></Input>
          </div>
        </form>
      {:else if params.section === 'profile'}
        <form action="?/update-profile" id="profile-form" method="post">
          <div class="input-group">
            <label class="text-xl" for="display-name">Display name</label>
            <Input
              class="w-min"
              id="display-name"
              name="display-name"
              value={data.self.displayName}
            />
          </div>

          <div class="input-group">
            <label class="text-xl" for="description">Description</label>
            <Input
              class="w-min"
              id="description"
              name="description"
              value={data.self.description ?? ''}
              placeholder="No description"
              textarea
            />
          </div>

          <div class="input-group">
            <label class="text-xl" for="description">Profile picture</label>
            <div class="flex w-full items-stretch gap-8">
              <img
                class="profile-picture-lg"
                src={profileValue
                  ? profileValue
                  : (data.self.profilePicture ?? '/images/default-user-profile-icon.jpg')}
                alt="user-profile"
              />

              <FileDropzone
                contentInputName="profile-picture"
                bind:contentValue={profileValue}
                filenameInputName="profile-picture-name"
                bind:filenameValue={profileFilenameValue}
              />
            </div>
          </div>
        </form>
      {:else if params.section === 'danger'}
        <form action="?/delete-account" id="delete-form" method="post">
          <!-- {#if data.self.role !== 'admin'} -->
          <div class="flex flex-col gap-2">
            <p class="text-xl">Delete account</p>
            <div class="flex gap-4">
              <Input
                name="password"
                type="password"
                bind:value={passwordValue}
                placeholder="Enter your password"
              />
              <Button
                type="danger"
                disabled={passwordValue.length <= 0}
                onclick={(ev) => {
                  ev.preventDefault();
                  showModal = true;
                }}
              >
                Delete
              </Button>
            </div>
          </div>
          <!-- {/if} -->
        </form>
      {/if}
    </div>
  </div>

  {#snippet right()}
    <div class="right-sidebar">
      {#each items as item}
        <div class="flex">
          <div
            class={[
              params.section === item ? 'highlighted' : 'not-highlighted',
              'mr-4 w-0 border-l-3',
            ]}
          ></div>
          <a
            class={[
              'py-2',
              params.section === item
                ? `font-semibold  ${item.includes('danger') ? 'text-red-600' : 'text-gray-300'}`
                : `${item.includes('danger') ? 'text-red-800' : 'text-gray-500'}`,
            ]}
            href="/settings/{item}"
          >
            {capitalize(item)}
          </a>
        </div>
      {/each}
    </div>
  {/snippet}

  <Modal id="delete-modal-account-{data.self.id}" bind:show={showModal} center>
    <ModalHeader>Delete account</ModalHeader>
    <ModalBody>
      Are you sure you want to delete your account? This action is irreversible and all data can not
      be recovered.
    </ModalBody>
    <ModalFooter>
      <Button
        class="w-full"
        type="danger"
        onclick={() => {
          showModal = false;
          (document.querySelector('form#delete-form') as HTMLFormElement | null)?.submit();
        }}
      >
        Delete
      </Button>
      <Button class="w-full" type="dark" onclick={() => (showModal = false)}>Cancel</Button>
    </ModalFooter>
  </Modal>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .sticky-header {
    @apply sticky top-0 border-r border-b border-gray-700 bg-gray-950 py-4 text-center text-2xl;
  }

  .form-button {
    @apply flex flex-row-reverse items-baseline gap-4;
  }

  .input-group {
    @apply flex flex-col items-start gap-2;
  }

  .highlighted {
    @apply border-l-gray-300;
  }

  .not-highlighted {
    @apply border-l-transparent;
  }

  .right-sidebar {
    @apply flex w-fit flex-col py-20 text-xl;
  }
</style>

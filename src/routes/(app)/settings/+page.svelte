<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Tab, TabBar } from '$lib/components/link';
  import { ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { FileDropzone } from '$lib/components/upload';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  const tab = $derived(page.url.searchParams.get('tab') ?? 'account');
  const items = ['account', 'profile', 'danger'];
  let passwordValue = $state<string>('');
  let profileValue = $state<string>('');
  let showModal = $state<'delete' | null>(null);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>Settings - topix</title>
</svelte:head>

<ReturnHeader>Settings</ReturnHeader>

<TabBar class="mb-4">
  {#each items as item}
    <Tab href="?tab={item}" selected={tab === item}>
      {capitalize(item)}
    </Tab>
  {/each}
</TabBar>

{#if tab === 'account'}
  <form
    class="flex flex-col gap-6"
    action="?/update-account"
    method="post"
    use:enhance={() => {
      return async ({ result, update }) => {
        await formResultToast(result, toaster);
        await update();
      };
    }}
  >
    <Button class="ml-auto w-fit" type="success">Save</Button>
    <div class="input-group">
      <label class="text-xl" for="username">Username</label>
      <Input class="w-min" id="username" name="username" value={data.self.username}></Input>
    </div>
  </form>
{:else if tab === 'profile'}
  <form
    class="flex flex-col gap-6"
    action="?/update-profile"
    method="post"
    use:enhance={() => {
      return async ({ result, update }) => {
        await formResultToast(result, toaster);
        await update();
      };
    }}
  >
    <Button class="ml-auto w-fit" type="success">Save</Button>
    <div class="input-group">
      <label class="text-xl" for="display-name">Display name</label>
      <Input class="w-min" id="display-name" name="display-name" value={data.self.displayName} />
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

        <FileDropzone contentInputName="profile-picture" bind:contentValue={profileValue} />
      </div>
    </div>
  </form>
{:else if tab === 'display'}{:else if tab === 'danger'}
  {#if data.self.role !== 'admin'}
    <div class="flex flex-col gap-2">
      <p class="text-xl">Delete account</p>
      <div class="flex gap-4">
        <Button type="danger" onclick={() => (showModal = 'delete')}>Delete</Button>
      </div>
    </div>
  {/if}
{/if}

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
  <ModalHeader>Delete account</ModalHeader>
  <ModalBody>
    <form
      class="flex flex-col gap-6"
      action="?/delete-account"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster, 'Account deleted successfully.');
          await update();
          hideModal();
          passwordValue = '';
        };
      }}
    >
      <p>
        Are you sure you want to delete your account? This action is irreversible and any post,
        thread and owned group can not be recovered.
      </p>
      <div class="flex flex-col gap-4 md:flex-row">
        <Input
          name="password"
          type="password"
          bind:value={passwordValue}
          placeholder="Enter your password"
        />
        <Button type="danger" disabled={passwordValue.length <= 0}>Delete</Button>
      </div>
    </form>
  </ModalBody>
</Modal>

<style lang="postcss">
  @reference '@/app.css';

  .input-group {
    @apply flex flex-col items-start gap-2;
  }
</style>

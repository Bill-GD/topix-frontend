<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { HomeLayout } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { FileDropzone } from '$lib/components/upload';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import { getTheme } from '$lib/utils/theme.svelte';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const toaster = getToaster();
  const theme = getTheme();
  const items = ['account', 'profile', 'display', 'danger'];
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

<HomeLayout self={data.self}>
  <ReturnHeader>Settings</ReturnHeader>

  <div
    class="no-scrollbar flex justify-around overflow-x-scroll border-b border-gray-400 md:hidden dark:border-gray-700"
  >
    {#each items as item}
      <a
        class={[
          'w-full py-2 text-center',
          params.section === item
            ? 'bg-zinc-300/40 font-semibold dark:bg-zinc-800/40 dark:text-gray-300'
            : 'text-gray-500',
        ]}
        href={item}
      >
        {capitalize(item)}
      </a>
    {/each}
  </div>

  <div class="p-4 lg:p-12">
    {#if params.section === 'account'}
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
    {:else if params.section === 'profile'}
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

            <FileDropzone contentInputName="profile-picture" bind:contentValue={profileValue} />
          </div>
        </div>
      </form>
    {:else if params.section === 'display'}
      <div class="input-group">
        <span class="text-xl">Theme</span>
        <div class="flex w-full justify-center gap-4">
          <label
            class="theme-input flex w-full items-center rounded-lg border border-gray-400 bg-zinc-100 p-6 text-black md:w-fit md:gap-4"
            for="light-theme"
          >
            <input
              class="bg-zinc-100 hover:not-checked:bg-zinc-300"
              type="radio"
              id="light-theme"
              name="theme"
              checked={!theme.isDark}
              oninput={() => theme.toggle('light')}
            />
            <span class="mx-auto font-bold">Light</span>
          </label>
          <label
            class="theme-input flex w-full items-center rounded-lg border border-gray-700 bg-zinc-950 p-6 text-white md:w-fit md:gap-4"
            for="dark-theme"
          >
            <input
              class="bg-zinc-950 hover:not-checked:bg-zinc-700"
              type="radio"
              id="dark-theme"
              name="theme"
              checked={theme.isDark}
              oninput={() => theme.toggle('dark')}
            />
            <span class="mx-auto font-bold">Dark</span>
          </label>
        </div>
      </div>
    {:else if params.section === 'danger'}
      {#if data.self.role !== 'admin'}
        <div class="flex flex-col gap-2">
          <p class="text-xl">Delete account</p>
          <div class="flex gap-4">
            <Button type="danger" onclick={() => (showModal = 'delete')}>Delete</Button>
          </div>
        </div>
      {/if}
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
              params.section === item
                ? `font-semibold ${item.includes('danger') ? 'text-red-600' : 'dark:text-gray-300'}`
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
          Are you sure you want to delete your account? This action is irreversible and all data can
          not be recovered.
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
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .input-group {
    @apply flex flex-col items-start gap-2;
  }

  .theme-input {
    input {
      @apply rounded-md transition-all duration-150 checked:border-2 checked:border-sky-500 checked:bg-sky-500;
    }

    &,
    * {
      @apply cursor-pointer;
    }
  }
</style>

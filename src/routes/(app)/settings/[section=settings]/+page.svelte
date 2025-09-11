<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from './$types';
  import { capitalize } from '@/lib/utils/helpers';
  import { Button, FileDropzone, Icon, IconButton, Input } from '@/lib/components';

  let { data, form }: PageProps = $props();

  const items = ['account', 'profile'];
  let passwordValue = $state<string>('');
  let profileValue = $state<string>('');
  let profileFilenameValue = $state<string>('');
</script>

<svelte:head>
  <title>Settings - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="sticky top-0 border-r border-b border-gray-700 py-4 text-center text-2xl">
    <div class="relative">
      <IconButton class="absolute left-4 hover:bg-gray-800" onclick={() => window.history.back()}>
        <Icon type="back" />
      </IconButton>
    </div>
    Settings
  </div>

  <form class="p-4 md:p-20" method="post">
    <div class="flex flex-row-reverse items-baseline gap-4">
      <Button
        class="mb-4 w-fit"
        formaction="?/update-{data.pathname.includes('account') ? 'account' : 'profile'}"
        type="success"
      >
        Save
      </Button>
      {#if form}
        <span class={form.success ? 'text-green-500' : 'text-red-500'}>{form.message}</span>
      {/if}
    </div>

    <div class="flex flex-col gap-6">
      {#if data.pathname.includes('account')}
        <div class="flex flex-col gap-2">
          <label class="text-xl" for="username">Username</label>
          <Input class="w-min" id="username" name="username" value={data.self.username}></Input>
        </div>

        {#if data.self?.role !== 'admin'}
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
                formaction="?/delete-account"
                type="danger"
                disabled={passwordValue.length <= 0}
              >
                Delete
              </Button>
            </div>
          </div>
        {/if}
      {:else if data.pathname.includes('profile')}
        <div class="flex flex-col items-start gap-2">
          <label class="text-xl" for="display-name">Display name</label>
          <Input
            class="w-min"
            id="display-name"
            name="display-name"
            value={data.self.displayName}
          />
        </div>

        <div class="flex flex-col items-start gap-2">
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

        <div class="flex items-stretch gap-8">
          <img
            class="aspect-square h-30 w-30 rounded-full"
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
            allowedTypes={['image']}
          />
        </div>
      {/if}
    </div>
  </form>

  {#snippet right()}
    <div class="flex w-fit flex-col gap-2 py-20 text-xl">
      {#each items as item}
        <a
          class={[data.pathname.includes(item) && 'highlighted', 'pr-4 text-gray-500']}
          href="/settings/{item}"
        >
          {capitalize(item)}
        </a>
      {/each}
    </div>
  {/snippet}
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .highlighted {
    @apply border-r-3 border-r-gray-300 font-semibold text-gray-300;
  }
</style>

<script lang="ts">
  import { formResultToast } from '$lib/utils/helpers';
  import { IconButton, Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Icon } from '$lib/components/misc';
  import { FileDropzone } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import { getToaster } from '$lib/components/toast';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let saving = $state<boolean>(false);
  let bannerValue = $derived<string>('');
  let filenameValue = $state<string>('');
</script>

<svelte:head>
  <title>Settings | {data.group.name} - topix</title>
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

  <div class="p-4 lg:p-12">
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
        <label class="text-xl" for="description">Banner picture</label>
        <img
          class="rounded-md"
          src={bannerValue ? bannerValue : (data.group.bannerPicture ?? '/images/no-image.jpg')}
          alt="user-profile"
        />

        <FileDropzone
          contentInputName="group-banner"
          bind:contentValue={bannerValue}
          filenameInputName="group-banner-name"
          bind:filenameValue
        />
      </div>
    </form>
  </div>
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

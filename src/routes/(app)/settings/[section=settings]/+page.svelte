<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from './$types';
  import { capitalize } from '@/lib/utils/helpers';
  import { Button, Input } from '@/lib/components';

  let { data, form }: PageProps = $props();

  const items = ['account', 'profile'];
</script>

<svelte:head>
  <title>Settings - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <form class="flex flex-col gap-6 p-20" method="post">
    <div class="flex items-baseline gap-4 self-end">
      {#if form}
        <span class={form.success ? 'text-green-500' : 'text-red-500'}>{form.message}</span>
      {/if}
      <Button
        class="mb-4 w-fit"
        formaction="?/update-{data.pathname.includes('account') ? 'account' : 'profile'}"
        type="success"
      >
        Save
      </Button>
    </div>

    {#if data.pathname.includes('account')}
      <div class="flex flex-col items-start gap-2">
        <label class="text-xl" for="username">Username</label>
        <Input class="w-min" id="username" name="username" value={data.self.username}></Input>
      </div>

      {#if data.self?.role !== 'admin'}
        <div class="flex flex-col items-start gap-2">
          <p class="text-xl">Delete account</p>
          <Button class="mb-4 w-fit" formaction="?/delete-account" type="danger">Delete</Button>
        </div>
      {/if}
    {:else if data.pathname.includes('profile')}
      <div class="flex flex-col items-start gap-2">
        <label class="text-xl" for="display-name">Display name</label>
        <Input class="w-min" id="display-name" name="display-name" value={data.self.displayName}
        ></Input>
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
        ></Input>
      </div>

      <div class="flex items-center gap-4">
        <img
          class="h-24 w-24 rounded-full"
          src={data.self.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="user-profile"
        />
        <input type="file" name="profile-picture" id="profile-picture" />
      </div>
    {/if}
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

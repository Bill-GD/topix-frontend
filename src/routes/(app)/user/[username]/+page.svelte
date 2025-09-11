<script lang="ts">
  import { IconButton } from '@/lib/components';
  import type { PageProps } from './$types';
  import Icon from '@/lib/components/Icon.svelte';
  import { HomeLayout } from '@/lib/layouts';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.user.displayName} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="relative">
    <IconButton
      class="absolute top-4 left-4 hover:bg-gray-800"
      onclick={() => window.history.back()}
    >
      <Icon type="back" />
    </IconButton>
  </div>

  <div class="border-r-1 border-b-1 border-gray-700 px-8 pt-16 pb-4">
    <div class="flex items-start gap-8">
      <img
        class="aspect-square h-30 w-30 rounded-full"
        src={data.user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
        alt="user-profile"
      />

      <div class="flex flex-col gap-4">
        <div class="flex items-baseline gap-6">
          <span class="text-3xl font-semibold">{data.user.displayName}</span>
          <span class="text-base text-gray-500">@{data.user.username}</span>
        </div>
        <p class="text-xl text-wrap overflow-ellipsis">
          {data.user.description ?? 'No description.'}
        </p>
      </div>
    </div>

    <div class="mt-4 flex items-baseline gap-6 text-lg font-semibold">
      <p>Following: {data.user.followingCount}</p>
      <p>Follower: {data.user.followerCount}</p>

      <IconButton class="ml-auto gap-4 hover:bg-gray-800">
        Message
        <Icon type="message" />
      </IconButton>
    </div>
  </div>
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';
</style>

<script lang="ts">
  import { HomeLayout } from '$lib/components/layout';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<HomeLayout self={data.self}>
  <div class="border-b border-gray-700 py-4 text-center text-xl font-semibold">Users</div>

  <div class="flex flex-col">
    {#each data.users as user}
      <a
        class="flex items-center gap-4 p-4 hover:bg-gray-800/40"
        href="/user/{user.username}"
        data-sveltekit-preload-data="tap"
      >
        <img
          class="profile-picture-md"
          src={user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
          alt="profile"
        />
        <div class="flex flex-col gap-2">
          <p class="text-gray-700">#{user.id}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-semibold">{user.displayName}</span>
            <span class="text-gray-500">@{user.username}</span>
          </div>
          <p>Role: {user.role}</p>
        </div>
      </a>
      <hr class="text-gray-700" />
    {/each}
  </div>
</HomeLayout>

<script lang="ts">
  import { IconButton, Button } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { PostUpload } from '$lib/components/upload';
  import { HomeLayout } from '$lib/components/layout';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.user.displayName} - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div class="profile-overview">
    <IconButton class="hover:bg-gray-800" onclick={() => window.history.back()}>
      <Icon type="back" />
    </IconButton>

    <div class="flex items-start gap-4">
      <img
        class="profile-picture-md"
        src={data.user.profilePicture ?? '/images/default-user-profile-icon.jpg'}
        alt="user-profile"
      />

      <div class="flex flex-col justify-start gap-2">
        <div class="flex items-baseline gap-4">
          <span class="text-2xl font-semibold">{data.user.displayName}</span>
          <span class="text-base text-gray-500">@{data.user.username}</span>
        </div>
        <p class="text-wrap overflow-ellipsis">
          {data.user.description ?? 'No description.'}
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <Button type="dark" class="w-full">Follow</Button>
        <Button type="dark" class="w-full">Message</Button>
      </div>
    </div>

    <div class="follow-stats">
      <p>Following: {data.user.followingCount}</p>
      <p>Follower: {data.user.followerCount}</p>
    </div>
  </div>

  {#if data.self.id === data.user.id}
    <PostUpload
      errorText={form?.success === false ? form?.message : ''}
      userPicture={data.self.profilePicture}
      formaction="?/post-upload"
    />
  {/if}

  {#each data.posts as post (post.id)}
    <Post self={data.self} {post} />
    <hr class="text-gray-700" />
  {/each}
</HomeLayout>

<style lang="postcss">
  @reference '@/app.css';

  .profile-overview {
    @apply flex flex-col gap-2 border-b border-gray-700 p-4;
  }

  .follow-stats {
    @apply flex items-baseline gap-6 px-4 py-2 font-semibold;
  }
</style>

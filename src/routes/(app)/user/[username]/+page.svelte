<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader, VisibilitySelector } from '$lib/components/misc';
  import { Modal, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { Post } from '$lib/components/post';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  let showModal = $state<'thread' | null>(null);
  let threadTitle = $state<string>('');
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let posts = $derived(data.posts);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>{data.user.displayName} - topix</title>
</svelte:head>

<ReturnHeader>{data.user.displayName}</ReturnHeader>

<div class="mb-4 flex flex-col gap-2 rounded-lg bg-zinc-50 p-4 box-drop-shadow">
  <div class="flex items-start gap-4">
    <img
      class="profile-picture-sm md:profile-picture-md"
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
  </div>

  <div class="flex items-baseline gap-4 px-2 py-2 font-semibold md:gap-6 md:px-4">
    <p>Following: {data.user.followingCount}</p>
    <p>Follower: {data.user.followerCount}</p>

    <div class="ml-auto flex gap-2 md:gap-4">
      {#if data.self.id === data.user.id}
        <DropdownMenu class="ml-auto h-fit" position="bottom" align="right">
          {#snippet trigger()}
            <IconButton round>
              <Icon type="bar" size="sm" />
            </IconButton>
          {/snippet}

          <DropdownItem href="/user/{data.self.username}/hidden/post">
            View hidden items
          </DropdownItem>
        </DropdownMenu>
      {:else}
        <IconButton type="dark" class="w-full">
          <Icon type="message" size="sm" />
        </IconButton>
        {#if data.user.followed}
          <form
            action="?/unfollow"
            method="post"
            use:enhance={() => {
              return async ({ result, update }) => {
                await formResultToast(result, toaster);
                await update();
              };
            }}
          >
            <IconButton type="danger" class="w-full">
              <Icon type="unfollow" size="sm" />
            </IconButton>
            <input type="number" name="user-id" value={data.user.id} hidden readonly />
          </form>
        {:else}
          <form
            action="?/follow"
            method="post"
            use:enhance={() => {
              return async ({ result, update }) => {
                await formResultToast(result, toaster);
                await update();
              };
            }}
          >
            <IconButton type="dark" class="w-full">
              <Icon type="follow" size="sm" />
            </IconButton>
            <input type="number" name="user-id" value={data.user.id} hidden readonly />
          </form>
        {/if}
      {/if}
    </div>
  </div>
</div>

{#if data.self.id === data.user.id}
  <PostUpload
    class="mb-4"
    userPicture={data.self.profilePicture}
    formaction="?/post-upload"
    showVisibilitySelector
  />
{/if}

<div class="flex flex-col gap-4">
  {#each posts as post (post.id)}
    <Post self={data.self} {post} />
  {/each}
</div>

<Scroller
  disabled={disableScroller}
  attachmentCallback={async () => {
    const res = await fetch(`/api/posts?username=${data.user.username}&page=${++pageIndex}`);
    const newData = await res.json();
    if (newData.length <= 0) disableScroller = true;
    posts = [...posts, ...newData];
  }}
  detachCleanup={() => {
    pageIndex = 1;
    disableScroller = false;
  }}
/>

<!-- {#snippet right()}
    <div class="flex flex-col gap-4">
      <div class="rounded-md border border-gray-700 2xl:max-w-1/2">
        <div class="flex items-baseline p-4">
          <p class="text-xl font-semibold">Threads</p>
          {#if data.self.id === data.user.id}
            <IconButton type="success" class="ml-auto" onclick={() => (showModal = 'thread')}>
              <Icon type="add" size="xs" />
            </IconButton>
          {/if}
        </div>

        {#if data.threads.length <= 0}
          <Divider />
          <p class="w-full px-4 py-2">This user has no thread.</p>
        {:else}
          {#each data.threads as thread}
            <Divider />
            <ThreadOverview {thread} />
          {/each}
        {/if}
      </div>

      <div class="rounded-md border border-gray-700 2xl:max-w-1/2">
        <div class="flex items-baseline p-4">
          <p class="text-xl font-semibold">Groups</p>
        </div>

        {#if data.groups.length <= 0}
          <Divider />
          <p class="w-full px-4 py-2">This user has no thread.</p>
        {:else}
          {#each data.groups as group}
            <Divider />

            <a
              class="flex items-center gap-4 px-4 py-2 hover:bg-zinc-300/40 dark:hover:bg-zinc-900/40"
              href="/groups/{group.id}"
            >
              <div class="flex flex-col gap-2">
                <span class="text-xl font-semibold">{group.name}</span>
                <div class="flex items-baseline gap-2 text-gray-500">
                  {#if group.visibility === 'private'}
                    <Icon type="lock" size="xs" />
                  {:else if group.visibility === 'hidden'}
                    <Icon type="eyeSlash" size="xs" />
                  {/if}
                  {capitalize(group.visibility)}
                  -
                  {group.memberCount} member{group.memberCount > 1 ? 's' : ''}
                </div>
              </div>

              {#if group.status !== null}
                <div
                  class={[
                    'ml-auto font-semibold',
                    group.status ? 'text-green-700' : 'text-sky-500',
                  ]}
                >
                  {group.status ? 'Joined' : 'Pending'}
                </div>
              {/if}
            </a>
          {/each}
        {/if}
      </div>
    </div>
  {/snippet} -->

<Modal show={showModal === 'thread'} backdropCallback={hideModal} center>
  <ModalHeader>Create thread</ModalHeader>
  <form
    class="flex w-full flex-col gap-4"
    action="?/create-thread"
    method="post"
    use:enhance={() => {
      return async ({ result, update }) => {
        await formResultToast(result, toaster);
        await update();
      };
    }}
  >
    <FloatingLabelInput
      class="w-full"
      name="thread-title"
      labelClass="bg-zinc-200 dark:bg-zinc-900"
      bind:value={threadTitle}
    >
      Title
    </FloatingLabelInput>

    <VisibilitySelector />

    <ModalFooter>
      <Button class="w-full" type="success" onclick={hideModal}>Create</Button>
      <Button
        class="w-full"
        type="dark"
        onclick={(ev) => {
          ev.preventDefault();
          hideModal();
        }}
      >
        Cancel
      </Button>
    </ModalFooter>
  </form>
</Modal>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Tab, TabBar } from '$lib/components/link';
  import { Icon, ReturnHeader, VisibilitySelector } from '$lib/components/misc';
  import { Modal, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { GroupOverview, ThreadOverview } from '$lib/components/overview';
  import { Post } from '$lib/components/post';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { capitalize, formResultToast, tooltip } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  const items = $derived(['posts', 'threads', 'groups']);
  const tab = $derived(page.url.searchParams.get('tab') ?? 'posts');
  let showModal = $state<'thread' | null>(null);
  let threadTitle = $state<string>('');
  let pageIndex = 1;
  let disableScroller = $state<boolean>(false);
  let posts = $derived(data.posts);
  let threads = $derived(data.threads);
  let groups = $derived(data.groups);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>{data.user.displayName} - topix</title>
</svelte:head>

<ReturnHeader>{data.user.displayName}</ReturnHeader>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-4 box">
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

    <div class="flex items-center gap-4 font-semibold md:gap-6 md:px-4">
      <p>Following: {data.user.followingCount}</p>
      <p>Follower: {data.user.followerCount}</p>

      <div class="ml-auto flex gap-2 md:gap-4">
        {#if data.self.id === data.user.id}
          <DropdownMenu class="ml-auto h-fit" position="bottom" align="right">
            {#snippet trigger()}
              <IconButton class="p-2" {@attach tooltip('Options')} round>
                <Icon type="bar" size="sm" />
              </IconButton>
            {/snippet}

            <DropdownItem href="/user/{data.self.username}/hidden">View hidden items</DropdownItem>
          </DropdownMenu>
        {:else}
          <IconButton type="dark" class="w-full" {@attach tooltip('Message')}>
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
              <IconButton type="danger" class="w-full" {@attach tooltip('Unfollow')}>
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
              <IconButton type="dark" class="w-full" {@attach tooltip('Follow')}>
                <Icon type="follow" size="sm" />
              </IconButton>
              <input type="number" name="user-id" value={data.user.id} hidden readonly />
            </form>
          {/if}
        {/if}
      </div>
    </div>
  </div>

  <TabBar>
    {#each items as item}
      <Tab href="?tab={item}" selected={tab === item}>{capitalize(item)}</Tab>
    {/each}
  </TabBar>

  {#if tab === 'posts'}
    {#if data.self.id === data.user.id}
      <PostUpload
        userPicture={data.self.profilePicture}
        formaction="?/post-upload"
        showVisibilitySelector
      />
    {/if}
  {/if}

  {#if tab === 'posts'}
    {#each posts as post (post.id)}
      <Post self={data.self} {post} />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(`/api/posts?username=${data.user.username}&page=${++pageIndex}`);
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        posts = [...posts!, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {:else if tab === 'threads'}
    {#if data.self.id === data.user.id}
      <Button
        class="flex w-fit items-center gap-2 self-end"
        type="success"
        onclick={() => (showModal = 'thread')}
      >
        Create thread
        <Icon type="add" size="sm" />
      </Button>
    {/if}
    {#each threads as thread}
      <ThreadOverview {thread} />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/threads?username=${data.user.username}${data.self.username === data.user.username ? '&visibility=private' : ''}&page=${++pageIndex}`,
        );
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        threads = [...threads!, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {:else if tab === 'groups'}
    {#each groups as group}
      <GroupOverview {group} />
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(`/api/groups?ownerId=${data.user.id}&page=${++pageIndex}`);
        const newData = await res.json();
        if (newData.length <= 0) disableScroller = true;
        groups = [...groups!, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  {/if}
</div>

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
      labelClass="peer-focus:bg-zinc-200 peer-focus:dark:bg-zinc-900"
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

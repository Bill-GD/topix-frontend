<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Tab, TabBar } from '$lib/components/link';
  import { Flair, Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { ThreadOverview } from '$lib/components/overview';
  import { Post } from '$lib/components/post';
  import { getToaster } from '$lib/components/toast';
  import { PostUpload } from '$lib/components/upload';
  import { capitalize, formResultToast } from '$lib/utils/helpers';
  import type { Tag } from '$lib/utils/types';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  const tab = $derived(page.url.searchParams.get('tab') ?? 'posts');
  const items = ['posts', 'threads'];
  let showModal = $state<'thread' | 'leave' | 'delete' | 'tag' | null>(null);
  let showTagModal = $state<boolean>(false);
  let threadTitle = $state<string>('');
  let pageIndex = 1;
  let disableScroller = $derived({
    posts: data.endOfList,
    threads: data.endOfList,
  });
  let posts = $derived(data.posts);
  let threads = $derived(data.threads);
  let chosenTag = $state<Tag | null>(null);
  let selectedTag = $state<Tag | null>(null);

  function hideModal() {
    showModal = null;
  }
</script>

<svelte:head>
  <title>{data.group.name} - topix</title>
</svelte:head>

<ReturnHeader>Group</ReturnHeader>

<div class="flex flex-col gap-4">
  <div class="box p-0">
    <img
      class="object-fit rounded-t-lg"
      src={data.group.bannerPicture ?? '/images/no-image.jpg'}
      alt="group-banner"
    />

    <div class="flex flex-col gap-2 p-4">
      <p class="text-4xl font-bold">{data.group.name}</p>

      {#if data.group.description}
        <p>{data.group.description}</p>
      {/if}

      <div class="flex items-center">
        <div class="flex items-center gap-2 text-gray-500">
          {#if data.group.visibility === 'private'}
            <Icon type="lock" size="xs" />
          {:else if data.group.visibility === 'hidden'}
            <Icon type="eyeSlash" size="xs" />
          {/if}
          <span>{capitalize(data.group.visibility)}</span>
          <span>•</span>
          <span>{data.group.memberCount} member{data.group.memberCount > 1 ? 's' : ''}</span>
        </div>

        <div class="ml-auto flex items-center gap-2">
          {#if data.group.status !== null}
            <Button class="hover:bg-zinc-800" type="primary" disabled>
              {data.group.status ? 'Joined' : 'Pending'}
            </Button>
          {:else}
            <form
              class="w-full"
              action="?/join-group"
              method="post"
              use:enhance={() => {
                return async ({ result, update }) => {
                  await formResultToast(result, toaster);
                  await update();
                };
              }}
            >
              <Button class="hover:bg-zinc-800" type="primary">Join</Button>
            </form>
          {/if}

          <DropdownMenu class="ml-auto" position="bottom" align="right">
            {#snippet trigger()}
              <IconButton class="p-2" round>
                <Icon type="menu" size="sm" />
              </IconButton>
            {/snippet}

            <DropdownItem href="/groups/{data.group.id}/members">Members</DropdownItem>
            {#if data.self.id === data.group.owner.id}
              <DropdownItem href="/groups/{data.group.id}/pending">Pending posts</DropdownItem>
              <DropdownItem href="/groups/{data.group.id}/settings">Settings</DropdownItem>
              <DropdownItem class="text-red-500" onclick={() => (showModal = 'delete')}>
                Delete
              </DropdownItem>
            {:else if data.group.status !== null}
              <DropdownItem class="text-red-500" onclick={() => (showModal = 'leave')}>
                Leave
              </DropdownItem>
            {/if}
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>

  <TabBar>
    {#each items as item}
      <Tab href="?tab={item}" selected={tab === item}>
        {capitalize(item)}
      </Tab>
    {/each}
  </TabBar>

  {#if tab === 'posts' && data.group.status === true}
    <PostUpload
      userPicture={data.self.profilePicture}
      formaction="?/add-post"
      placeholder="Add new post"
      tags={data.tags}
      groupApproved={data.self.id === data.group.owner.id}
    />
  {/if}

  {#if tab === 'posts'}
    {#if data.group.visibility === 'private' && !data.group.status}
      <p class="empty-noti-text">You have to join to see posts of this group.</p>
    {:else if data.posts!.length <= 0}
      <p class="empty-noti-text">This group has no post.</p>
    {:else}
      {#each posts as post (post.id)}
        <Post self={data.self} {post} />
      {/each}

      <Scroller
        disabled={disableScroller[tab]}
        attachmentCallback={async () => {
          const res = await fetch(
            `/api/posts?groupId=${data.group.id}&threadId=null&accepted=true&page=${++pageIndex}`,
          );
          const newData = await res.json();
          disableScroller[tab] = res.headers.get('x-end-of-list') === 'true';
          posts = [...posts!, ...newData];
        }}
        detachCleanup={() => {
          pageIndex = 1;
          disableScroller[tab] = false;
        }}
      />
    {/if}
  {:else if tab === 'threads'}
    {#if data.group.visibility === 'private' && !data.group.status}
      <p class="empty-noti-text">You have to join to see threads of this group.</p>
    {:else if data.threads!.length <= 0}
      <p class="empty-noti-text">This group has no thread.</p>
    {:else}
      {#if data.group.status === true}
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
        disabled={disableScroller[tab]}
        attachmentCallback={async () => {
          const res = await fetch(`/api/threads?groupId=${data.group.id}&page=${++pageIndex}`);
          const newData = await res.json();
          disableScroller[tab] = res.headers.get('x-end-of-list') === 'true';
          threads = [...threads!, ...newData];
        }}
        detachCleanup={() => {
          pageIndex = 1;
          disableScroller[tab] = false;
        }}
      />
    {/if}
  {/if}
</div>

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
  <ModalHeader>Delete group</ModalHeader>
  <ModalBody>Are you sure you want to delete this group? This is irreversible.</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/delete-group"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster, 'Group deleted successfully.');
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
    </form>

    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal show={showModal === 'leave'} backdropCallback={hideModal} center>
  <ModalHeader>Leave group</ModalHeader>
  <ModalBody>Are you sure you want to leave this group?</ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/leave-group"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster);
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Leave</Button>
    </form>

    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

<Modal show={showModal === 'thread'} backdropCallback={hideModal} center>
  <ModalHeader>Create thread</ModalHeader>
  <ModalBody>
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

      {#if chosenTag}
        <button
          class="flex w-fit cursor-pointer items-center gap-2 text-zinc-500 hover:text-zinc-200"
          onclick={(ev) => {
            ev.preventDefault();
            showTagModal = true;
          }}
        >
          <input name="tag-id" type="number" value={chosenTag.id} hidden readonly />
          <Flair tag={chosenTag} />
          <Icon type="edit" size="sm" />
        </button>
      {:else if data.tags && data.tags.length > 0}
        <Button
          class="w-fit"
          type="dark"
          outline
          onclick={(ev) => {
            ev.preventDefault();
            showTagModal = true;
          }}
        >
          Choose tag
        </Button>
      {/if}

      <div class="flex w-full flex-col gap-2 md:flex-row">
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
      </div>
    </form>
  </ModalBody>
</Modal>

<Modal class="md:w-fit" show={showTagModal} backdropCallback={() => (showTagModal = false)} upper>
  <ModalHeader class="text-center">Select tag</ModalHeader>
  <ModalBody>
    <div class="flex flex-col gap-4">
      {#each data.tags! as tag}
        <div class="tag-input flex items-center gap-4">
          <input type="radio" id={`${tag.id}`} name="tag" oninput={() => (selectedTag = tag)} />
          <label for={`${tag.id}`}><Flair {tag} /></label>
        </div>
      {/each}
    </div>
  </ModalBody>
  <ModalFooter>
    <Button
      class="w-full"
      type="success"
      onclick={() => {
        showTagModal = false;
        chosenTag = selectedTag;
      }}
    >
      Confirm
    </Button>
    <Button
      class="w-full"
      type="dark"
      onclick={() => {
        showTagModal = false;
        selectedTag = null;
      }}
    >
      Cancel
    </Button>
    <Button
      class="w-full"
      type="dark"
      onclick={() => {
        showTagModal = false;
        selectedTag = chosenTag = null;
      }}
    >
      Remove
    </Button>
  </ModalFooter>
</Modal>

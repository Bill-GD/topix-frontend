<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, IconButton } from '$lib/components/button';
  import { DropdownItem, DropdownMenu } from '$lib/components/dropdown';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { Modal, ModalBody, ModalFooter, ModalHeader } from '$lib/components/modal';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast, getApiUrl, tooltip } from '$lib/utils/helpers';
  import type { ChatMessage } from '$lib/utils/types';
  import { io, Socket } from 'socket.io-client';
  import { onMount, tick } from 'svelte';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const toaster = getToaster();
  const otherUser = $derived(
    data.self.id === data.channel.firstUser?.id ? data.channel.secondUser : data.channel.firstUser,
  );
  let ws: Socket = io(`${getApiUrl()}/chatws`, { auth: { token: `Bearer ${data.token}` } });
  let showModal = $state<'delete' | null>(null);
  let disableScroller = $derived(data.endOfList);
  let messages = $derived(processMessageList(data.messages));
  let messageInput = $state<string>('');
  let hoverId = $state<number>(-1);
  let messageContainer: Element;

  function processMessageList(messages: ChatMessage[]) {
    const res = [];
    let prevSender = -1,
      prevTime = -1;

    for (let i = messages.length - 1; i >= 0; i--) {
      const curSender = messages[i].sender.id,
        curTime = Date.parse(messages[i].sentAt);

      const showTimeDivider = curTime - prevTime > 600000;
      prevTime = curTime;

      const hideSender = !showTimeDivider && curSender === prevSender;
      prevSender = curSender;

      res.unshift({
        message: messages[i],
        hideSender,
        showTimeDivider,
      });
    }

    return res;
  }

  function hideModal() {
    showModal = null;
  }

  onMount(() => {
    ws.on('connect', () => {
      ws.emit('join', { channelId: params.id });
      ws.emit('seen', { channelId: params.id });
    });

    ws.on('connect_error', (err) => {
      console.error(err);
    });

    ws.on('send', async (data) => {
      messages = processMessageList([data, ...messages.map((e) => e.message)]);
      await tick();
      messageContainer.scrollTo({ top: messageContainer.scrollHeight });
      ws.emit('seen', { channelId: params.id });
    });

    ws.on('remove', async (data) => {
      const msgIndex = messages.findIndex((e) => e.message.id === data);
      messages = processMessageList(
        [...messages.slice(0, msgIndex), ...messages.slice(msgIndex + 1)].map((e) => e.message),
      );
    });

    messageContainer.scrollTo({ top: messageContainer.scrollHeight });
  });
</script>

<svelte:head>
  <title>Chat - topix</title>
</svelte:head>

<ReturnHeader>Chat with {otherUser?.displayName ?? '[Deleted user]'}</ReturnHeader>

<div class="flex h-[calc(100dvh-(var(--header-height)*2.2))] flex-col box">
  <div class="flex items-center gap-2 pb-4">
    <img
      class="profile-picture-sm"
      src={otherUser?.profilePicture ?? '/images/default-user-profile-icon.jpg'}
      alt="profile"
    />
    <a
      class="z-1 font-semibold text-black hover:underline dark:text-white dark:decoration-white"
      href={otherUser ? '/user/{otherUser.username}' : ''}
    >
      {otherUser?.displayName ?? '[Deleted user]'}
    </a>

    <IconButton class="ml-auto p-2 hover:bg-zinc-300" onclick={() => (showModal = 'delete')}>
      <Icon type="delete" class="text-red-500" size="sm" />
    </IconButton>
  </div>

  <div
    class="flex scrollbar h-full flex-col-reverse overflow-y-scroll"
    bind:this={messageContainer}
  >
    {#each messages as { message, hideSender, showTimeDivider }}
      <div
        class={['flex items-center gap-2 ', hideSender ? 'mt-px' : 'mt-2']}
        onmouseenter={() => (hoverId = message.id)}
        onmouseleave={() => (hoverId = -1)}
        tabindex="-1"
        role="dialog"
      >
        {#if hideSender}
          <div class="profile-picture-xs sm:profile-picture-sm"></div>
        {:else}
          <img
            class="profile-picture-xs sm:profile-picture-sm"
            src={message.sender.profilePicture ?? '/images/default-user-profile-icon.jpg'}
            alt="profile"
          />
        {/if}
        <div
          class="max-w-5/6 rounded-md bg-zinc-100 px-3 py-2 md:max-w-3/4 dark:bg-zinc-800"
          {@attach tooltip(new Date(message.sentAt).toLocaleString('en-GB'))}
        >
          {message.content}
        </div>

        {#if data.self.id === message.sender.id && message.id === hoverId && otherUser}
          <DropdownMenu class="h-fit" position="top" align="right">
            {#snippet trigger()}
              <IconButton class="p-1" round>
                <Icon class="text-zinc-500" type="menu" size="sm" />
              </IconButton>
            {/snippet}

            <DropdownItem
              class="text-red-500"
              onclick={() => ws.emit('remove', { channelId: params.id, messageId: message.id })}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        {/if}
      </div>
      {#if showTimeDivider}
        <p class="mt-4 mb-2 text-center text-sm font-semibold text-zinc-500">
          {new Date(message.sentAt).toLocaleString('en-gb')}
        </p>
      {/if}
    {/each}

    <Scroller
      endedText="No more messages."
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(
          `/api/chat?id=${params.id}&messages&timestamp=${Date.parse(messages.at(-1)!.message.sentAt)}`,
        );
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        messages = processMessageList([...messages.map((e) => e.message), ...newData]);
      }}
      detachCleanup={() => {
        disableScroller = false;
      }}
    />
  </div>

  {#if otherUser}
    <form
      class="flex gap-2 pt-4"
      method="post"
      onsubmit={(ev) => {
        ev.preventDefault();
        ws.emit('send', { channelId: params.id, content: messageInput });
        messageInput = '';
      }}
    >
      <Input bind:value={messageInput} placeholder="Send a message" />
      <Button type="success">Send</Button>
    </form>
  {:else}
    <p class="pt-4 text-center">You can no longer send message.</p>
  {/if}
</div>

<Modal show={showModal === 'delete'} backdropCallback={hideModal} center>
  <ModalHeader>Delete chat channel</ModalHeader>
  <ModalBody>
    Are you sure you want to delete this channel? All messages will be unrecoverable.
  </ModalBody>
  <ModalFooter>
    <form
      class="w-full"
      action="?/delete-channel"
      method="post"
      use:enhance={() => {
        return async ({ result, update }) => {
          await formResultToast(result, toaster, 'Deleted chat successfully');
          await update();
        };
      }}
    >
      <Button class="w-full" type="danger" onclick={hideModal}>Delete</Button>
    </form>
    <Button class="w-full" type="dark" onclick={hideModal}>Cancel</Button>
  </ModalFooter>
</Modal>

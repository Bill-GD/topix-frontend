<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { ReturnHeader } from '$lib/components/misc';
  import { getApiUrl } from '$lib/utils/helpers';
  import type { ChatMessage } from '$lib/utils/types';
  import { io, Socket } from 'socket.io-client';
  import { onMount, tick } from 'svelte';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const otherUser = $derived(
    data.self.id === data.channel.firstUser.id ? data.channel.secondUser : data.channel.firstUser,
  );
  let ws: Socket = io(`${getApiUrl()}/chatws`, { auth: { token: `Bearer ${data.token}` } });
  let pageIndex = 1;
  let disableScroller = $derived(data.endOfList);
  let messages = $derived<ChatMessage[]>(data.messages);
  let messageInput = $state<string>('');
  let event = $state<string>('');
  let messageList: Element;

  onMount(() => {
    ws.on('connect', () => {
      ws.emit('join', { channelId: params.id }, (data: any) => {
        event = `${data}`;
      });
    });

    ws.on('connect_error', (err) => {
      console.error(err);
    });

    ws.on('send', async (data) => {
      messages = [...messages, data];
      await tick();
      messageList.scrollTo({ top: messageList.scrollHeight });
    });

    messageList.scrollTo({ top: messageList.scrollHeight });
  });
</script>

<svelte:head>
  <title>Chat - topix</title>
</svelte:head>

<ReturnHeader>Chat with {otherUser.displayName}</ReturnHeader>

{#snippet messageSnippet(message: ChatMessage)}
  <div class="flex max-w-3/4 items-center gap-2">
    <img
      class="profile-picture-sm"
      src={message.sender.profilePicture ?? '/images/default-user-profile-icon.jpg'}
      alt="profile"
    />
    <div class="rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
      {message.content}
    </div>
  </div>
{/snippet}

<div class="flex h-[calc(100dvh-(var(--header-height)*2.2))] flex-col box">
  <div class="flex items-center gap-2 pb-4">
    <img
      class="profile-picture-sm"
      src={otherUser.profilePicture ?? '/images/default-user-profile-icon.jpg'}
      alt="profile"
    />
    <a
      class="z-1 font-semibold text-black hover:underline dark:text-white dark:decoration-white"
      href="/user/{otherUser.username}">{otherUser.displayName}</a
    >
  </div>

  <div class="flex h-full flex-col-reverse gap-4 overflow-y-scroll" bind:this={messageList}>
    {#each messages as message}
      {@render messageSnippet(message)}
    {/each}

    <Scroller
      disabled={disableScroller}
      attachmentCallback={async () => {
        const res = await fetch(`/api/chat?id=${params.id}&messages&page=${++pageIndex}`);
        const newData = await res.json();
        disableScroller = res.headers.get('x-end-of-list') === 'true';
        messages = [...messages!, ...newData];
      }}
      detachCleanup={() => {
        pageIndex = 1;
        disableScroller = false;
      }}
    />
  </div>

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
</div>

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { ReturnHeader } from '$lib/components/misc';
  import { getApiUrl } from '$lib/utils/helpers';
  import type { ChatMessage } from '$lib/utils/types';
  import { io, Socket } from 'socket.io-client';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  const otherUser = $derived(
    data.self.id === data.channel.firstUser.id ? data.channel.secondUser : data.channel.firstUser,
  );
  let ws: Socket = io(`${getApiUrl()}/chatws`, { auth: { token: `Bearer ${data.token}` } });
  let messages = $derived<ChatMessage[]>(data.messages);
  let messageInput = $state<string>('');
  let event = $state<string>('');

  onMount(() => {
    console.log(data.channel);

    ws.on('connect', () => {
      ws.emit('join', { channelId: params.id }, (data: any) => {
        event = `${data}`;
      });
    });

    ws.on('connect_error', (err) => {
      console.error(err);
    });

    ws.on('send', (data) => {
      messages.push(data);
    });
  });
</script>

<svelte:head>
  <title>Chat - topix</title>
</svelte:head>

<ReturnHeader>Chat with {otherUser.displayName}</ReturnHeader>

{#snippet messageSnippet(message: ChatMessage)}
  <div class="flex items-center gap-2">
    <img
      class="profile-picture-sm"
      src={message.sender.profilePicture ?? '/images/default-user-profile-icon.jpg'}
      alt="profile"
    />
    <div class="rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
      {message.sender.displayName} sent "{message.content}" at {message.sentAt}
    </div>
  </div>
{/snippet}

<div class="flex h-[calc(100dvh-(var(--header-height)*2))] flex-col box">
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

  <div class="flex h-full flex-col gap-4 overflow-y-scroll">
    {#each messages as message}
      {@render messageSnippet(message)}
    {/each}
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
    <Input bind:value={messageInput} />
    <Button type="primary">Send</Button>
  </form>
</div>

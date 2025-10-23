<script lang="ts">
  import { Button } from '$lib/components/button';
  import { getApiUrl } from '$lib/utils/helpers';
  import { io, Socket } from 'socket.io-client';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let ws: Socket = io(`${getApiUrl()}/chatws`, { auth: { token: `Bearer ${data.token}` } });
  let message = $state<string>('');
  let response = $state<string>('');
  let event = $state<string>('');

  onMount(() => {
    ws.on('connect', () => {
      message = 'Connected';
    });

    ws.on('connect_error', (err) => {
      console.error(err);
    });

    ws.on('send', (data) => {
      event = `${data}`;
    });
  });
</script>

<svelte:head>
  <title>Chat - topix</title>
</svelte:head>

<Button
  type="primary"
  onclick={() => {
    message = 'Sent';
    ws.emit('send', 'test message', (res: any) => {
      response = `${res}`;
      message = 'Connected';
    });
  }}
>
  Send
</Button>

<p>Message: {message}</p>
<p>Reponse: {response}</p>
<p>Event: {event}</p>

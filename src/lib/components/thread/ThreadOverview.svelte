<script lang="ts">
  import type { Thread } from '$lib/utils/types';
  import Flair from '../misc/Flair.svelte';
  import { onMount } from 'svelte';

  let { thread }: { thread: Thread } = $props();

  onMount(() => {
    const main = document.getElementById(`thread-overview-${thread.id}`) as HTMLElement;
    main.addEventListener('click', (ev) => {
      ev.preventDefault();
      window.location.href = `${thread.groupId !== null ? `/groups/${thread.groupId}` : ''}/thread/${thread.id}`;
    });
  });
</script>

<div
  class="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-900/40"
  id="thread-overview-{thread.id}"
>
  <div class="flex flex-col items-start">
    <span class="line-clamp-1">{thread.title}</span>
    <span class="line-clamp-1 text-gray-500">
      {thread.postCount} post{thread.postCount > 1 ? 's' : ''}
    </span>
  </div>

  {#if thread.tag}
    <Flair class="ml-auto" tag={thread.tag} />
  {/if}
</div>

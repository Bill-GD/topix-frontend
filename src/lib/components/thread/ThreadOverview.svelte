<script lang="ts">
  import type { Thread } from '$lib/utils/types';
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
  class="flex cursor-pointer flex-col items-start px-4 py-2 hover:bg-gray-900/40"
  id="thread-overview-{thread.id}"
>
  <span class="line-clamp-1">{thread.title}</span>
  <span class="line-clamp-1 text-gray-500">
    {thread.postCount} post{thread.postCount > 1 ? 's' : ''}
  </span>
</div>

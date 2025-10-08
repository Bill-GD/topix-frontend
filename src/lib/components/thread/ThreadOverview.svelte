<script lang="ts">
  import type { Thread } from '$lib/utils/types';
  import Flair from '../misc/Flair.svelte';
  import Icon from '../misc/Icon.svelte';

  let { thread }: { thread: Thread } = $props();
</script>

<a
  class="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-300/60 dark:hover:bg-gray-900/60"
  href="/threads/{thread.id}"
>
  <div class="flex flex-col items-start">
    <div class="flex items-center gap-2">
      <span class="line-clamp-1">{thread.title}</span>

      {#if thread.visibility === 'private'}
        <Icon type="lock" size="xs" />
      {:else if thread.visibility === 'hidden'}
        <Icon type="eyeSlash" size="xs" />
      {/if}
    </div>
    <span class="line-clamp-1 text-gray-500">
      {thread.postCount} post{thread.postCount > 1 ? 's' : ''}
    </span>
  </div>

  {#if thread.tag}
    <Flair class="ml-auto" tag={thread.tag} />
  {/if}
</a>

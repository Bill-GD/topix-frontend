<script lang="ts">
  import { capitalize } from '$lib/utils/helpers';
  import type { Group } from '$lib/utils/types';
  import Icon from '../misc/Icon.svelte';

  let { group, showOwner = false }: { group: Group; showOwner?: boolean } = $props();
</script>

<a
  class="flex cursor-pointer items-center gap-4 box hover:bg-zinc-200 dark:hover:bg-zinc-900/40"
  href="/groups/{group.id}"
>
  <div class="w-30 overflow-hidden rounded-md">
    <img src={group.bannerPicture ?? '/images/no-image.jpg'} alt="group-banner" />
  </div>

  <div class="flex flex-col gap-2">
    <span class="text-xl font-semibold">{group.name}</span>
    <div class="flex items-baseline gap-2 text-gray-500">
      {#if group.visibility === 'private'}
        <Icon type="lock" size="xs" />
      {:else if group.visibility === 'hidden'}
        <Icon type="eyeSlash" size="xs" />
      {/if}
      {capitalize(group.visibility)}
      •
      {group.memberCount} member{group.memberCount > 1 ? 's' : ''}
    </div>
    {#if showOwner}
      <p>Owner: {group.owner.displayName}</p>
    {/if}
  </div>

  {#if group.status !== null}
    <div class={['ml-auto font-semibold', group.status ? 'text-green-700' : 'text-sky-500']}>
      {group.status ? 'Joined' : 'Pending'}
    </div>
  {/if}
</a>

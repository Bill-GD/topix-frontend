<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/button';
  import { Input } from '$lib/components/input';
  import { Scroller } from '$lib/components/layout';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { UserOverview } from '$lib/components/overview';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let pageIndex = 1;
  let disableScroller = $state<boolean>(data.endOfList);
  let users = $derived(data.users);
  let searchString = $derived<string>(decodeURIComponent(page.url.searchParams.get('q') ?? ''));
  let searched = $derived<boolean>(page.url.searchParams.has('q'));
</script>

<svelte:head>
  <title>Users - topix</title>
</svelte:head>

<ReturnHeader>Users</ReturnHeader>

<div class="flex flex-col gap-4">
  <form
    class="relative"
    method="post"
    onsubmit={(ev) => {
      ev.preventDefault();
      goto(`?q=${encodeURIComponent(searchString)}`, { replaceState: true });
    }}
  >
    <Input
      name="search-string"
      bind:value={searchString}
      clearable
      placeholder="Search by username or display name"
    >
      {#snippet prefixIcon()}
        <Icon class="text-zinc-500" type="search" size="sm" />
      {/snippet}
    </Input>
  </form>

  {#if searched}
    <Button
      class="mr-auto"
      type="base"
      outline
      onclick={() => {
        goto(`/users`, { replaceState: true });
      }}
    >
      Clear result
    </Button>
  {/if}

  {#if searched && users.length <= 0}
    <p class="p-4 text-center text-xl font-semibold">No result found.</p>
  {:else}
    {#each users as user}
      <UserOverview {user} />
    {/each}
  {/if}

  <Scroller
    disabled={disableScroller}
    hideText={searched && users.length <= 0}
    attachmentCallback={async () => {
      const res = await fetch(
        `/api/users?page=${++pageIndex}${searched ? `&name=${searchString}` : ''}`,
      );
      const newData = await res.json();
      disableScroller = res.headers.get('x-end-of-list') === 'true';
      users = [...users, ...newData];
    }}
    detachCleanup={() => {
      pageIndex = 1;
      disableScroller = false;
    }}
  />
</div>

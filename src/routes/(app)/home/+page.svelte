<script lang="ts">
  import { page } from '$app/state';
  import { HomeLayout } from '$lib/components/layout';
  import { capitalize } from '@/lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const tab = $derived(page.url.searchParams.get('tab'));
  const items = ['new', 'following'];
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <div
    class="no-scrollbar sticky top-0 flex overflow-x-scroll border-b border-gray-400 dark:border-gray-700"
  >
    {#each items as item}
      <a
        class={[
          'flex-1 px-4 py-2 text-center',
          tab === item
            ? 'bg-gray-300/40 font-semibold dark:bg-gray-800/40 dark:text-gray-300'
            : 'text-gray-500',
        ]}
        href="?tab={item}"
        data-sveltekit-replacestate
      >
        {capitalize(item)}
      </a>
    {/each}
  </div>
</HomeLayout>

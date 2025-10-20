<script lang="ts">
  import { IconButton } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { getTheme } from '$lib/utils/theme.svelte';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  const theme = getTheme();
</script>

<IconButton class="absolute top-4 right-4 z-1 p-2" onclick={() => theme.toggle()}>
  <Icon class="text-zinc-800 dark:text-zinc-300" type={theme.isDark ? 'moon' : 'sun'} />
</IconButton>

<main class="flex h-screen items-center justify-center">
  <div class="mx-2 box text-center md:w-1/2 lg:w-1/3 xl:w-1/4">
    {@render children()}
  </div>
</main>

<script lang="ts">
  import { ThemeToggle } from '$lib/components/misc';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<ThemeToggle class="absolute top-4 right-4 z-1" />

<main class="flex h-screen items-center justify-center">
  <div class="mx-2 text-center">
    {@render children?.()}
  </div>
</main>

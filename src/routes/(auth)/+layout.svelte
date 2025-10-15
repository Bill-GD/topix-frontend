<script lang="ts">
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<main class="flex h-dvh items-center justify-center bg-zinc-100 dark:bg-zinc-950 dark:text-white">
  <div
    class="w-11/12 rounded-xl border px-2 py-8 text-center md:w-1/2 md:px-4 lg:w-1/3 lg:px-8 xl:w-1/4 dark:border-gray-700"
  >
    {@render children()}
  </div>
</main>

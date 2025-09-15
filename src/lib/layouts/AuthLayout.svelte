<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<main class="flex h-dvh items-center justify-center bg-gray-950 text-white">
  <div
    class="w-11/12 rounded-xl border px-2 py-8 text-center lg:w-1/2 lg:w-1/3 lg:px-4 lg:px-8 xl:w-1/4"
  >
    {@render children()}
  </div>
</main>

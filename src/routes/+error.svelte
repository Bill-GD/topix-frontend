<script lang="ts">
  import { page } from '$app/state';
  import { Link } from '$lib/components/link';

  console.log('error.svelte');
</script>

<svelte:head>
  <title>{page.status} - {page.error?.message}</title>
  <meta name="root-error" />
</svelte:head>

{#if page.error}
  <div class="flex h-dvh flex-col items-center justify-center gap-2 bg-gray-950 text-white">
    <h1 class="py-4 text-8xl font-bold text-red-600">{page.status}</h1>
    <p class="text-xl font-bold">{page.error.message}</p>
    <Link href="/home">Back to home</Link>
  </div>
{/if}

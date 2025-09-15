<script lang="ts">
  import { page } from '$app/state';
  import { Link } from '@/lib/components';
</script>

<svelte:head>
  <title>{page.error?.message}</title>
  <meta name="root-error" />
</svelte:head>

{#if page.error}
  <div class="flex h-dvh flex-col items-center justify-center gap-2 bg-gray-950 text-white">
    <h1 class="text-8xl font-bold text-red-500">{page.error.status ?? 404}</h1>
    <p class="text-2xl font-bold">{page.error.message}</p>
    <Link href="/home">Back to home</Link>
  </div>
{/if}

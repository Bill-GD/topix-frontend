<script lang="ts">
  import '../app.css';
  import 'tippy.js/dist/tippy.css';
  import type { LayoutProps } from './$types';
  import { setContext } from 'svelte';

  let { children, data }: LayoutProps = $props();

  setContext('API_URL', `${data.env.API_SERVER}:${data.env.API_PORT}`);
</script>

<main class="flex h-dvh items-center justify-center bg-gray-950">
  {@render children()}
</main>

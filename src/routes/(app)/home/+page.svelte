<script lang="ts">
  import { HomeLayout } from '$lib/layouts';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}></HomeLayout>

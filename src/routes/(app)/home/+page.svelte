<script lang="ts">
  import { HomeLayout } from '$lib/components/layout';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}></HomeLayout>

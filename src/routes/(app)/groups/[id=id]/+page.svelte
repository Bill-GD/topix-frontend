<script lang="ts">
  import { HomeLayout } from '$lib/components/layout';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<HomeLayout self={data.self}>
  <p>single group</p>
</HomeLayout>

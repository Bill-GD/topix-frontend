<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from '../../$types';

  let { data }: PageProps = $props();
</script>

<HomeLayout self={data.self}></HomeLayout>

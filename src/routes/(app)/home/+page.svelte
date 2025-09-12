<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import type { PageProps } from '../../$types';
  import { PostUpload } from '@/lib/components';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <PostUpload userProfilePicture={data.self.profilePicture}></PostUpload>
</HomeLayout>

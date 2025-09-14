<script lang="ts">
  import { HomeLayout } from '@/lib/layouts';
  import { PostUpload } from '@/lib/components';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Home - topix</title>
</svelte:head>

<HomeLayout self={data.self}>
  <PostUpload
    errorText={form?.success === false ? form?.message : ''}
    userId={data.self.id}
    userProfilePicture={data.self.profilePicture}
  />
</HomeLayout>

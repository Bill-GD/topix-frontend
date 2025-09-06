<script lang="ts">
  import { Button, Error, FloatingLabelInput, Link } from '@/lib/components';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<svelte:head>
  <title>Register - topix</title>
</svelte:head>

<p class="text-4xl font-semibold">Sign in to your account</p>

<form class="mt-8 flex flex-col gap-6" method="post">
  {#if form?.missing}<Error>All fields must not be empty.</Error>{/if}
  {#if form?.success === false}<Error>{form?.message}</Error>{/if}

  <div class="flex flex-col gap-4">
    <FloatingLabelInput
      class="w-full"
      name="username"
      type="text"
      required
      value={form?.username ?? ''}
    >
      Username
    </FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="password" type="password" peekable required>
      Password
    </FloatingLabelInput>

    <Button type="success">Login</Button>
  </div>

  <hr class="text-gray-700" />

  <div>
    <Link href="/register">Don't have an account?</Link>
  </div>
</form>

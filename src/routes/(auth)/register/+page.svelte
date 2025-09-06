<script lang="ts">
  import { Button, FloatingLabelInput, Link, Error } from '@/lib/components';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<svelte:head>
  <title>Register - topix</title>
</svelte:head>

<p class="text-4xl font-semibold">Sign up for topix</p>

<form class="mt-8 flex flex-col gap-6" method="post">
  {#if form?.missing}<Error>All fields must not be empty.</Error>{/if}
  {#if form?.invalid}<Error>Email format is invalid.</Error>{/if}
  {#if form?.success === false}<Error>{form?.message}</Error>{/if}

  <div class="flex flex-col gap-4">
    <FloatingLabelInput class="w-full" name="email" type="email" required value={form?.email ?? ''}>
      Email
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      name="username"
      type="text"
      required
      value={form?.username ?? ''}
    >
      Username
    </FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="password" type="password" required>
      Password
    </FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="confirm-password" type="password" required>
      Confirm password
    </FloatingLabelInput>

    <Button type="success">Register</Button>
  </div>

  <hr class="text-gray-700" />

  <div>
    <Link href="/login">Already have an account?</Link>
  </div>
</form>

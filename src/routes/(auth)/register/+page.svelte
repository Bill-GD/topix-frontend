<script lang="ts">
  import { Button, Error, FloatingLabelInput, Link } from '@/lib/components';
  import type { PageProps } from './$types';
  import { AuthLayout } from '@/lib/layouts';

  let { form }: PageProps = $props();
</script>

<svelte:head>
  <title>Register - topix</title>
</svelte:head>

<AuthLayout>
  <p>Sign up for topix</p>

  <form method="post">
    {#if form?.missing}<Error>All fields must not be empty.</Error>{/if}
    {#if form?.invalid}<Error>Email format is invalid.</Error>{/if}
    {#if form?.success === false}<Error>{form?.message}</Error>{/if}

    <div>
      <FloatingLabelInput
        class="w-full"
        name="email"
        type="email"
        required
        value={form?.email ?? ''}
      >
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

      <FloatingLabelInput class="w-full" name="password" type="password" peekable required>
        Password
      </FloatingLabelInput>

      <FloatingLabelInput class="w-full" name="confirm-password" type="password" peekable required>
        Confirm password
      </FloatingLabelInput>

      <Button type="success">Register</Button>
    </div>

    <hr class="text-gray-700" />

    <Link href="/login">Already have an account?</Link>
  </form>
</AuthLayout>

<style lang="postcss">
  @reference "@/app.css";

  p {
    @apply text-4xl font-semibold;
  }

  form {
    @apply mt-8 flex flex-col gap-6;
  }

  div {
    @apply flex flex-col gap-4;
  }
</style>

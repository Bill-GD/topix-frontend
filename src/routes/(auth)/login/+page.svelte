<script lang="ts">
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Link } from '$lib/components/link';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<svelte:head>
  <title>Login - topix</title>
</svelte:head>

<p>Sign in to your account</p>

<form method="post">
  {#if form?.missing}<span class="text-red-500">All fields must not be empty.</span>{/if}
  {#if form?.success === false}<span class="text-red-500">{form?.message}</span>{/if}

  <div>
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

  <Link href="/register">Don't have an account?</Link>
</form>

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

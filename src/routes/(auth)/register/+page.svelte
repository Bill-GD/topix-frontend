<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Link } from '$lib/components/link';
  import { Divider } from '$lib/components/misc';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';

  const toaster = getToaster();
</script>

<svelte:head>
  <title>Register - topix</title>
</svelte:head>

<p class="text-4xl font-semibold">Sign up for topix</p>

<form
  class="mt-8 flex flex-col gap-6"
  method="post"
  use:enhance={() => {
    return async ({ result, update }) => {
      await formResultToast(result, toaster, 'Registered successfully');
      await update();
    };
  }}
>
  <div class="flex flex-col gap-4">
    <FloatingLabelInput
      class="w-full"
      labelClass="bg-zinc-100 dark:bg-zinc-950"
      name="email"
      type="email"
      required>Email</FloatingLabelInput
    >

    <FloatingLabelInput
      class="w-full"
      labelClass="bg-zinc-100 dark:bg-zinc-950"
      name="username"
      type="text"
      required
    >
      Username
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="bg-zinc-100 dark:bg-zinc-950"
      name="password"
      type="password"
      peekable
      required
    >
      Password
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="bg-zinc-100 dark:bg-zinc-950"
      name="confirm-password"
      type="password"
      peekable
      required
    >
      Confirm password
    </FloatingLabelInput>

    <Button type="success">Register</Button>
  </div>

  <Divider />

  <Link href="/login">Already have an account?</Link>
</form>

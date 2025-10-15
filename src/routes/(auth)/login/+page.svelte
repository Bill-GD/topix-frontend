<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Link } from '$lib/components/link';
  import { Divider } from '$lib/components/misc';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';

  const toaster = getToaster();
  let password = $state<string>('');
</script>

<svelte:head>
  <title>Login - topix</title>
</svelte:head>

<p class="text-4xl font-semibold dark:text-white">Sign in to your account</p>

<form
  class="mt-8 flex flex-col gap-6"
  method="post"
  use:enhance={() => {
    return async ({ result, update }) => {
      await formResultToast(result, toaster, 'Signin successfully');
      await update();
      password = '';
    };
  }}
>
  <div class="flex flex-col gap-4">
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
      bind:value={password}
      peekable
      required
    >
      Password
    </FloatingLabelInput>

    <Button type="success">Login</Button>
  </div>

  <Divider />

  <Link href="/register">Don't have an account?</Link>
</form>

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

<p class="mb-4 text-4xl font-semibold dark:text-white">Log in to your account</p>
<span>
  <span class="text-zinc-500">Don't have an account?</span>
  <Link href="/register">Sign up</Link>
</span>

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
      labelClass="peer-[&:focus,&:not(:placeholder-shown)]:bg-zinc-50 peer-[&:focus,&:not(:placeholder-shown)]:dark:bg-zinc-950"
      name="username"
      type="text"
      required
    >
      Username
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="peer-[&:focus,&:not(:placeholder-shown)]:bg-zinc-50 peer-[&:focus,&:not(:placeholder-shown)]:dark:bg-zinc-950"
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
</form>

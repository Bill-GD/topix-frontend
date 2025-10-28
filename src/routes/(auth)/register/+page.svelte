<script lang="ts">
  import { enhance } from '$app/forms';
  import { ENABLE_EMAIL_VERIFICATION } from '$env/static/public';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Link } from '$lib/components/link';
  import { Divider, Icon } from '$lib/components/misc';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';

  const toaster = getToaster();
  const emailVerificationEnabled = $derived(ENABLE_EMAIL_VERIFICATION === 'true');
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
  {#if !emailVerificationEnabled}
    <div class="flex items-center gap-4 box">
      <Icon class="text-red-600" type="error" size="xl" />
      <span class="font-semibold">
        Normal account registration is currently disabled. Please use the 'Sign in with Google'
        option.
      </span>
    </div>
  {/if}
  <div class="flex flex-col gap-4">
    <FloatingLabelInput
      class="w-full"
      labelClass="not-peer-placeholder-shown:bg-zinc-50 not-peer-placeholder-shown:dark:bg-zinc-900"
      name="email"
      type="email"
      disabled={!emailVerificationEnabled}
      required
    >
      Email
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="not-peer-placeholder-shown:bg-zinc-50 not-peer-placeholder-shown:dark:bg-zinc-900"
      name="username"
      type="text"
      disabled={!emailVerificationEnabled}
      required
    >
      Username
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="not-peer-placeholder-shown:bg-zinc-50 not-peer-placeholder-shown:dark:bg-zinc-900"
      name="password"
      type="password"
      peekable
      disabled={!emailVerificationEnabled}
      required
    >
      Password
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="not-peer-placeholder-shown:bg-zinc-50 not-peer-placeholder-shown:dark:bg-zinc-900"
      name="confirm-password"
      type="password"
      peekable
      disabled={!emailVerificationEnabled}
      required
    >
      Confirm password
    </FloatingLabelInput>

    <Button type="success" disabled={!emailVerificationEnabled}>Register</Button>
  </div>

  <Divider />

  <Link href="/login">Already have an account?</Link>
</form>

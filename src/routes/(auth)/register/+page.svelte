<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { ENABLE_EMAIL_VERIFICATION } from '$env/static/public';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Link } from '$lib/components/link';
  import { Divider, Icon } from '$lib/components/misc';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const toaster = getToaster();
  const emailVerificationDisabled = $derived(
    !page.url.searchParams.has('oauth') && ENABLE_EMAIL_VERIFICATION !== 'true',
  );
</script>

<svelte:head>
  <title>Register - topix</title>
</svelte:head>

<p class="mb-4 text-4xl font-semibold">Sign up for topix</p>
<span>
  <span class="text-zinc-500">Already have an account?</span>
  <Link href="/login">Login</Link>
</span>

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
  {#if emailVerificationDisabled}
    <div class="flex items-center gap-4 box">
      <Icon class="text-red-600" type="error" size="xl" />
      <span class="font-semibold">
        Normal account registration is currently disabled. Please use the 'Sign up with Google'
        option.
      </span>
    </div>
  {/if}

  <div class="flex flex-col gap-4">
    <FloatingLabelInput
      class="w-full"
      labelClass="peer-[&:focus,&:not(:placeholder-shown)]:bg-zinc-50 peer-[&:focus,&:not(:placeholder-shown)]:dark:bg-zinc-950"
      name="email"
      type="email"
      value={data.email}
      disabled={emailVerificationDisabled}
      readonly={data.email.length > 0}
      required
    >
      Email
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="peer-[&:focus,&:not(:placeholder-shown)]:bg-zinc-50 peer-[&:focus,&:not(:placeholder-shown)]:dark:bg-zinc-950"
      name="username"
      type="text"
      value={data.username}
      disabled={emailVerificationDisabled}
      readonly={data.username.length > 0}
      required
    >
      Username
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="peer-[&:focus,&:not(:placeholder-shown)]:bg-zinc-50 peer-[&:focus,&:not(:placeholder-shown)]:dark:bg-zinc-950"
      name="password"
      type="password"
      peekable
      disabled={emailVerificationDisabled}
      required
    >
      Password
    </FloatingLabelInput>

    <FloatingLabelInput
      class="w-full"
      labelClass="peer-[&:focus,&:not(:placeholder-shown)]:bg-zinc-50 peer-[&:focus,&:not(:placeholder-shown)]:dark:bg-zinc-950"
      name="confirm-password"
      type="password"
      peekable
      disabled={emailVerificationDisabled}
      required
    >
      Confirm password
    </FloatingLabelInput>

    <Button type="success" disabled={emailVerificationDisabled}>Register</Button>
  </div>
</form>

<div class="mt-6 flex flex-col gap-6">
  <Divider>Or sign up with</Divider>

  <Button type="base" outline href="/google-oauth">
    <img class="mx-auto profile-picture-xs" src="/images/google-logo.svg" alt="google-logo" />
  </Button>
</div>

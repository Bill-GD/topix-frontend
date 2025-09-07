<script lang="ts">
  import { Button, FloatingLabelInput, Error } from '@/lib/components';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
  let message = $state<string>('We sent the code to the email you specified.');

  if (form?.success === true) {
    message = 'The code has been resent. Please check your email.';
  }
</script>

<svelte:head>
  <title>Confirm email - topix</title>
</svelte:head>

<p>Verify your email</p>

{#if !form || form?.success === true}
  <p class="mt-8 {message.startsWith('The') ? 'text-green-700' : ''}">{message}</p>
{/if}

<form method="post">
  {#if form?.missing}<Error>You must enter the code.</Error>{/if}
  {#if form?.success === false}<Error>{form?.message}</Error>{/if}

  <div>
    <FloatingLabelInput class="w-full" name="otp" type="text">Code</FloatingLabelInput>

    <Button formaction="?/otp" type="success">Send</Button>
    <Button formaction="?/resend" type="dark">Send again</Button>
  </div>
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

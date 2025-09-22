<script lang="ts">
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
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

<p class="title">Verify your email</p>

{#if !form || form?.success === true}
  <p class="mt-8 {message.startsWith('The') ? 'text-green-700' : ''}">{message}</p>
{/if}

<form method="post">
  {#if form?.missing}<span class="text-red-500">You must enter the code.</span>{/if}
  {#if form?.success === false}<span class="text-red-500">{form?.message}</span>{/if}

  <FloatingLabelInput class="w-full" name="otp" type="text">Code</FloatingLabelInput>

  <Button formaction="?/otp" type="success">Send</Button>
  <Button formaction="?/resend" type="dark">Send again</Button>
</form>

<style lang="postcss">
  @reference "@/app.css";

  .title {
    @apply text-4xl font-semibold;
  }

  form {
    @apply mt-8 flex flex-col gap-6;
  }
</style>

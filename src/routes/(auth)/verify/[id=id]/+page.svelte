<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { getToaster } from '$lib/components/toast';
  import type { ActionData } from './$types';

  const toaster = getToaster();
</script>

<svelte:head>
  <title>Confirm email - topix</title>
</svelte:head>

<p class="title">Verify your email</p>

<p class="mt-8">We sent the code to the email you specified.</p>

<form
  method="post"
  use:enhance={() => {
    return async ({ result, update }) => {
      switch (result.type) {
        case 'success': {
          const formResult = result.data as ActionData;
          toaster.addToast(formResult!.message, 'success');
          break;
        }
        case 'failure': {
          const formResult = result.data as ActionData;
          toaster.addToast(formResult!.message, 'error');
          break;
        }
        case 'error': {
          toaster.addToast(result.error, 'error');
          break;
        }
        case 'redirect': {
          toaster.addToast('Account verified', 'success');
          await update();
          break;
        }
      }
    };
  }}
>
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

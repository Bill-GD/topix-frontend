<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { getToaster } from '$lib/components/toast';
  import { formResultToast } from '$lib/utils/helpers';

  const toaster = getToaster();
</script>

<svelte:head>
  <title>Confirm email - topix</title>
</svelte:head>

<p class="text-4xl font-semibold">Verify your email</p>

<p class="mt-8">We sent the code to the email you specified.</p>

<form
  class="mt-8 flex flex-col gap-6"
  method="post"
  use:enhance={() => {
    return async ({ result, update }) => {
      await formResultToast(result, toaster, 'Account verified.');
      await update();
    };
  }}
>
  <FloatingLabelInput
    class="w-full"
    labelClass="bg-zinc-100 dark:bg-zinc-950"
    name="otp"
    type="text"
  >
    Code
  </FloatingLabelInput>

  <Button formaction="?/otp" type="success">Send</Button>
  <Button formaction="?/resend" type="dark">Send again</Button>
</form>

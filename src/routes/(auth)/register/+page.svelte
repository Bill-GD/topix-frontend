<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/button';
  import { FloatingLabelInput } from '$lib/components/input';
  import { Link } from '$lib/components/link';
  import { getToaster } from '$lib/components/toast';
  import type { ActionData } from './$types';

  const toaster = getToaster();
</script>

<svelte:head>
  <title>Register - topix</title>
</svelte:head>

<p>Sign up for topix</p>

<form
  method="post"
  use:enhance={() => {
    return async ({ result, update }) => {
      switch (result.type) {
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
          toaster.addToast('Registered successfully', 'success');
          await update();
          break;
        }
      }
    };
  }}
>
  <div>
    <FloatingLabelInput class="w-full" name="email" type="email" required>Email</FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="username" type="text" required>
      Username
    </FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="password" type="password" peekable required>
      Password
    </FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="confirm-password" type="password" peekable required>
      Confirm password
    </FloatingLabelInput>

    <Button type="success">Register</Button>
  </div>

  <hr class="text-gray-700" />

  <Link href="/login">Already have an account?</Link>
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

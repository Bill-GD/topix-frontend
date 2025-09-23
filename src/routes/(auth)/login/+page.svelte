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
  <title>Login - topix</title>
</svelte:head>

<p>Sign in to your account</p>

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
          toaster.addToast('Signin successfully', 'success');
          await update();
          break;
        }
      }
    };
  }}
>
  <div>
    <FloatingLabelInput class="w-full" name="username" type="text" required>
      Username
    </FloatingLabelInput>

    <FloatingLabelInput class="w-full" name="password" type="password" peekable required>
      Password
    </FloatingLabelInput>

    <Button type="success">Login</Button>
  </div>

  <hr class="text-gray-700" />

  <Link href="/register">Don't have an account?</Link>
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

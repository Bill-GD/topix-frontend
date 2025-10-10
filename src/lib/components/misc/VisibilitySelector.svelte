<script lang="ts">
  import { capitalize } from '$lib/utils/helpers';
  import type { ClassValue } from 'svelte/elements';
  import Button from '../button/Button.svelte';

  let {
    class: className,
    visibility = 'public',
    name = 'visibility',
  }: {
    visibility?: 'public' | 'private' | 'hidden';
    name?: string;
    class?: ClassValue;
  } = $props();

  const modes = ['public', 'private', 'hidden'];
  let index = Math.max(
    0,
    modes.findIndex((e) => e === visibility),
  );
</script>

<Button
  class={[className]}
  type="dark"
  outline
  onclick={(ev) => {
    ev.preventDefault();
    index = (index + 1) % 3;
    visibility = modes[index] as 'public' | 'private' | 'hidden';
  }}
>
  {capitalize(visibility)}
  <input {name} value={visibility} hidden readonly />
</Button>

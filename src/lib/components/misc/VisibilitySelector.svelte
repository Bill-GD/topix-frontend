<script lang="ts">
  import { capitalize } from '$lib/utils/helpers';
  import Button from '../button/Button.svelte';

  let {
    visibility = 'public',
    name = 'visibility',
  }: { visibility?: 'public' | 'private' | 'hidden'; name?: string } = $props();

  const modes = ['public', 'private', 'hidden'];
  let index = Math.max(
    0,
    modes.findIndex((e) => e === visibility),
  );
</script>

<Button
  class="w-full"
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

<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon } from '$lib/components/misc';
  import { getTheme } from '$lib/utils/theme.svelte';
  import type { ClassValue } from 'svelte/elements';

  let { class: className }: { class?: ClassValue } = $props();

  const theme = getTheme();
</script>

<Button class={['p-2', className]} onclick={() => theme.toggle()}>
  <Icon type={theme.isDark ? 'moon' : 'sun'} />
</Button>

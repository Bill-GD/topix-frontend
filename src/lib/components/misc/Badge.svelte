<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  let { text, class: className }: { text: string; class?: ClassValue } = $props();
</script>

<div
  class={[
    'flex items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white',
    text.length >= 3 ? 'px-1' : 'aspect-square min-w-5',
    className,
  ]}
>
  {text}
</div>

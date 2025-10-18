<script lang="ts">
  import { getContrastColor } from '$lib/utils/helpers';
  import type { Tag } from '$lib/utils/types';
  import type { ClassValue } from 'svelte/elements';

  let {
    tag,
    class: className,
    compact = false,
  }: {
    tag: Tag;
    class?: ClassValue;
    compact?: boolean;
  } = $props();
  let textColor = $derived(getContrastColor(tag.color));
</script>

<span
  class={['w-fit rounded-lg text-base font-semibold', compact ? 'px-2' : 'px-3 py-2', className]}
  style:background-color="#{tag.color}"
  style:color={textColor}
>
  {tag.name}
</span>

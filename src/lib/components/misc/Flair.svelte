<script lang="ts">
  import type { FlairProps } from '$lib/components/types';
  import { getContrastColor } from '$lib/utils/helpers';

  let { tag, class: className, compact = false }: FlairProps = $props();
  let textColor = $derived(getContrastColor(tag.color));
</script>

<span
  class={['w-fit rounded-lg text-base font-semibold', compact ? 'px-2' : 'px-3 py-2', className]}
  style:background-color="#{tag.color}"
  style:color={textColor}
>
  {tag.name}
</span>

<script lang="ts">
  import type { FlairProps } from '$lib/components/types';
  import { getContrastColor } from '$lib/utils/helpers';

  let { tag, class: className }: FlairProps = $props();
  let textColor = $derived(getContrastColor(tag.color));
</script>

<span
  class={['w-fit rounded-md px-2 text-base font-semibold', className]}
  style:background-color="#{tag.color}"
  style:color={textColor}
>
  {tag.name}
</span>

<script lang="ts">
  import type { FlairProps } from '$lib/components/types';
  import { getContrastColor } from '$lib/utils/helpers';

  let { tag }: FlairProps = $props();
  let textColor = $derived(getContrastColor(tag.color));
</script>

<span
  class="rounded-md px-2 py-1 text-base font-semibold"
  style:background-color="#{tag.color}"
  style:color={textColor}
>
  {tag.name}
</span>

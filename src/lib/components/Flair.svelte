<script lang="ts">
  import type { FlairProps } from '$lib/components/types';
  import { getContrastColor } from '$lib/utils/helpers';

  let props: FlairProps = $props();
  let textColor = $derived(getContrastColor(props.color));
</script>

<span
  class="rounded-md px-2 py-1 text-base font-semibold"
  style:background-color="#{props.color}"
  style:color={textColor}
>
  {props.title}
</span>

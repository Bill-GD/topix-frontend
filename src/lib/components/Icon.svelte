<script lang="ts">
  import { Icons, type IconProps } from '@/utils/component-types';

  let { type, hover = false }: IconProps = $props();

  const color = Icons[type].color;
  // const iconName = Icons[type].icon.iconName;
  const icon = Icons[type].icon.icon;
</script>

{#if icon[4]}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class={['h-6', 'w-6', color, hover && 'hover:scale-150', 'transition-transform']}
    viewBox="0 0 {icon[0]} {icon[1]}"
    role="img"
  >
    <g>
      {#if typeof icon[4] == 'string'}
        <path d={icon[4]} fill={'currentColor'} />
      {/if}
    </g>
  </svg>
{/if}

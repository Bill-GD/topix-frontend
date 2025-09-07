<script lang="ts">
  import type { NavItemProps } from '@/lib/components/types';

  let props: NavItemProps = $props();
</script>

<a href={props.href}>
  <span class="hidden text-2xl text-white lg:inline">{props.title}</span>
  {@render props.children()}
</a>

<style lang="postcss">
  @reference '@/app.css';

  a {
    @apply flex w-fit cursor-pointer items-center justify-end gap-3 rounded-full p-2 hover:bg-gray-900 active:bg-gray-900 lg:w-full;
  }
</style>

<script lang="ts">
  import '@/app.css';
  import 'tippy.js/dist/tippy.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

{@render children()}

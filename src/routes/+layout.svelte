<script lang="ts">
  import 'tippy.js/dist/tippy.css';
  import '../app.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

{@render children()}

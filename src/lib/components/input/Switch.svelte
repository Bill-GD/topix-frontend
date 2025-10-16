<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  let {
    class: className,
    checked,
    onchange,
  }: {
    class?: ClassValue;
    checked: boolean;
    onchange: VoidFunction;
  } = $props();
</script>

<label class="relative inline-flex cursor-pointer">
  <input class="peer h-0 w-0 opacity-0" type="checkbox" {checked} {onchange} />
  <div
    class="relative h-6 w-10 rounded-full bg-zinc-400 duration-300 peer-checked:bg-blue-600 after:absolute after:top-1/2 after:left-1 after:h-4 after:w-4 after:-translate-y-1/2 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"
  ></div>
</label>

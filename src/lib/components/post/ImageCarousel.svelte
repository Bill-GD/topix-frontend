<script lang="ts">
  import { IconButton } from '../button';
  import { Icon } from '../misc';

  let { images }: { images: string[] } = $props();

  let imageIndex = $state<number>(0);
  let carousel: Element;

  $effect(() => {
    carousel.scrollTo({ left: carousel.clientWidth * imageIndex, behavior: 'smooth' });
  });
</script>

<div class="relative min-w-1/2">
  {#if imageIndex > 0}
    <IconButton
      class="absolute top-0 left-0 z-1 h-full bg-zinc-700/20 px-2 hover:bg-zinc-500/40 dark:hover:bg-zinc-900/20"
      onclick={() => {
        imageIndex = Math.max(0, imageIndex - 1);
      }}
    >
      <Icon class="text-zinc-300" type="back" size="sm" />
    </IconButton>
  {/if}

  <div
    class="flex w-full overflow-x-hidden rounded-lg bg-zinc-200 dark:bg-zinc-600"
    bind:this={carousel}
  >
    {#each images as imagePath}
      <div class="my-auto w-full flex-shrink-0">
        <img class="w-full object-contain align-middle" src={imagePath} alt="post-media" />
      </div>
    {/each}
  </div>

  {#if images.length > 1}
    <div
      class="absolute bottom-1 left-1/2 z-2 flex -translate-x-1/2 gap-1 rounded-full bg-zinc-700/60 p-2"
    >
      {#each new Array(images.length) as _, index}
        <button
          class={[
            'h-2 w-2 cursor-pointer rounded-full border border-white transition-colors duration-150',
            index === imageIndex ? 'bg-white' : 'hover:bg-zinc-400',
          ]}
          onclick={() => (imageIndex = index)}
          aria-label="carousel-indicator"
        ></button>
      {/each}
    </div>
  {/if}

  {#if imageIndex < images.length - 1}
    <IconButton
      class="absolute top-0 right-0 z-1 h-full bg-zinc-700/20 px-2 hover:bg-zinc-500/40 dark:hover:bg-zinc-900/20"
      onclick={() => {
        imageIndex = Math.min(images.length - 1, imageIndex + 1);
      }}
    >
      <Icon class="text-zinc-300" type="next" size="sm" />
    </IconButton>
  {/if}
</div>

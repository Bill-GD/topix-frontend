<script lang="ts">
  import { page } from '$app/state';
  import type { ClassValue } from 'svelte/elements';
  import { IconButton } from '../button';
  import { Icon } from '../misc';

  let {
    images,
    allowClickingImage = false,
    transparentBackground = false,
    imageClass,
  }: {
    images: string[];
    allowClickingImage?: boolean;
    transparentBackground?: boolean;
    imageClass?: ClassValue;
  } = $props();

  let imageIndex = $state<number>(0);
  // svelte-ignore non_reactive_update
  let carousel: Element;

  $effect(() => {
    carousel.scrollTo({ left: carousel.clientWidth * imageIndex, behavior: 'smooth' });
  });
</script>

{#snippet carouselImages()}
  {#each images as imagePath}
    <div class="my-auto w-full flex-shrink-0">
      <img
        class={['w-full object-contain align-middle', imageClass]}
        src={imagePath}
        alt="post-media"
      />
    </div>
  {/each}
{/snippet}

<div class="relative min-w-1/2">
  {#if imageIndex > 0}
    <IconButton
      class="absolute top-1/2 left-2 z-1 -translate-y-1/2 bg-zinc-800/60 p-3 hover:bg-zinc-700/60"
      onclick={() => {
        imageIndex = Math.max(0, imageIndex - 1);
      }}
    >
      <Icon class="text-zinc-300" type="back" size="sm" />
    </IconButton>
  {/if}

  {#if allowClickingImage}
    <a
      class="flex h-full w-full overflow-x-hidden rounded-lg bg-zinc-200 dark:bg-zinc-600"
      bind:this={carousel}
      href={page.url + (page.url.searchParams.size <= 0 ? '?' : '&') + 'view-image'}
      data-sveltekit-replacestate
    >
      {@render carouselImages()}
    </a>
  {:else}
    <div
      class={[
        'flex h-full w-full overflow-x-hidden rounded-lg',
        transparentBackground ? 'bg-transparent' : 'bg-zinc-200 dark:bg-zinc-600',
      ]}
      bind:this={carousel}
    >
      {@render carouselImages()}
    </div>
  {/if}

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
      class="absolute top-1/2 right-2 z-1 -translate-y-1/2 bg-zinc-800/60 p-3 hover:bg-zinc-700/60"
      onclick={() => {
        imageIndex = Math.min(images.length - 1, imageIndex + 1);
      }}
    >
      <Icon class="text-zinc-300" type="next" size="sm" />
    </IconButton>
  {/if}
</div>

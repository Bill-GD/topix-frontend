<script lang="ts">
  let {
    disabled,
    hideText = false,
    endedText = 'You reached the end.',
    attachmentCallback,
    detachCleanup,
  }: {
    disabled?: boolean;
    hideText?: boolean;
    endedText?: string;
    attachmentCallback: () => Promise<void>;
    detachCleanup: VoidFunction;
  } = $props();

  let isFetching = $state<boolean>(false);

  function scrollerAttachment(node: Element) {
    const observer = new IntersectionObserver(async (entries, observer) => {
      if (disabled || !entries[0].isIntersecting) return;

      isFetching = true;
      await attachmentCallback();
      isFetching = false;
    });

    observer.observe(node);

    return () => {
      detachCleanup();
      observer.disconnect();
    };
  }
</script>

<div class="py-2 text-center text-zinc-500 dark:text-gray-200" {@attach scrollerAttachment}>
  {#if !hideText}
    {#if isFetching}
      Loading more...
    {:else if disabled}
      {endedText}
    {:else}
      Load more.
    {/if}
  {/if}
</div>

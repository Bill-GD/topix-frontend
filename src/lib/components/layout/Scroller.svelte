<script lang="ts">
  let {
    disabled,
    hideText = false,
    attachmentCallback,
    detachCleanup,
  }: {
    disabled?: boolean;
    hideText?: boolean;
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

<div class="py-3 text-center text-gray-200" {@attach scrollerAttachment}>
  {#if !hideText}
    {#if isFetching}
      Loading more...
    {:else if disabled}
      You reached the end.
    {:else}
      Load more.
    {/if}
  {/if}
</div>

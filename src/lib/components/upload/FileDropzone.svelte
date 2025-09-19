<script lang="ts">
  import { onMount } from 'svelte';
  import type { FileDropzoneProps } from '$lib/components/types';

  let {
    filenameInputName,
    filenameValue = $bindable(''),
    contentInputName,
    contentValue = $bindable(''),
    class: className,
  }: FileDropzoneProps = $props();

  let hasDroppedFile = $state<boolean>(false);
  let dropzoneText = $state<string>('Drop image here');
  let errorText = $state<string>('');

  onMount(() => {
    const fileDrop = document.getElementById('file-drop');
    fileDrop?.addEventListener('dragover', (e) => {
      e.preventDefault();
      hasDroppedFile = true;
    });
    fileDrop?.addEventListener('dragleave', (e) => {
      e.preventDefault();
      hasDroppedFile = false;
    });

    fileDrop?.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!e.dataTransfer) return;

      const first = e.dataTransfer.items[0];
      if (first.kind !== 'file') return;
      const file = first.getAsFile();
      if (!file) return;

      const mime = file.type;
      if (!mime.includes('image')) {
        errorText = 'File type not allowed';
        return;
      }
      errorText = '';

      dropzoneText = file.name;
      filenameValue = file.name;
      hasDroppedFile = true;

      const fr = new FileReader();
      fr.onload = () => {
        contentValue = fr.result as string;
        // (document.querySelector('img[alt="user-profile"]')! as HTMLImageElement).src = contentValue;
      };
      fr.readAsDataURL(file);
    });
  });
</script>

<div class={[hasDroppedFile ? 'dropped' : 'empty', className]} id="file-drop">
  <p class={[errorText !== '' && 'text-red-500']}>{errorText !== '' ? errorText : dropzoneText}</p>
  <input class="hidden" type="text" name={filenameInputName} bind:value={filenameValue} />
  <input class="hidden" type="text" name={contentInputName} bind:value={contentValue} />
</div>

<style lang="postcss">
  @reference '@/app.css';

  #file-drop.empty {
    @apply flex w-full items-center justify-center rounded-md border border-gray-700 p-4;
  }

  #file-drop.empty p:not(.text-red-500) {
    @apply text-gray-700;
  }

  #file-drop.dropped {
    @apply flex w-full items-center justify-center rounded-md border p-4;
  }

  #file-drop.dropped p:not(.text-red-500) {
    @apply text-white;
  }
</style>

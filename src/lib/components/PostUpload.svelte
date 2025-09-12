<script lang="ts">
  import { onMount } from 'svelte';
  import type { PostUploadProps } from './types';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';

  let {
    userProfilePicture = '/images/default-user-profile-icon.jpg',
    formaction,
  }: PostUploadProps = $props();

  let inputContent = $state<string>('');
  let files = $state<string[]>([]);

  onMount(() => {
    const editor = document.getElementById('editor')!;

    editor.addEventListener('input', (ev) => {
      const trimmed = editor.innerText.trim();

      inputContent = trimmed.length > 0 ? editor.innerText : trimmed;

      editor.classList.toggle('empty', inputContent.length === 0);
    });
  });
</script>

<form class="main" method="post">
  <img class="profile-picture-sm" src={userProfilePicture} alt="profile" />

  <div class="flex w-full flex-col gap-4">
    <div
      id="editor"
      class="editor empty text-white"
      contenteditable
      role="textbox"
      aria-multiline="true"
      spellcheck="true"
      data-placeholder="What's happening?"
      bind:innerText={inputContent}
    >
      <input class="hidden" name="content" value={inputContent} />
    </div>

    {#if files.length > 0}
      <div class="media-viewer scrollbar">
        {#each files as file, index (index)}
          <div class="relative">
            <IconButton
              class="absolute top-0 right-0"
              onclick={(ev) => {
                ev.preventDefault();
                files.splice(index, 1);
              }}
            >
              <Icon class="text-gray-500 hover:cursor-pointer hover:text-gray-300" type="close" />
            </IconButton>
            <img class="aspect-square h-30 w-30 rounded-md" src={file} alt="user-profile" />
            <input class="hidden" name="files" value={file} />
          </div>
        {/each}
      </div>
    {/if}

    <div class="flex justify-end gap-4">
      <div class="flex items-center justify-center">
        <label for="file-input">
          <Icon type="image" class="text-gray-500 hover:cursor-pointer hover:text-gray-300" />
        </label>
        <input
          class="hidden"
          type="file"
          id="file-input"
          onchange={(event) => {
            const selectedFiles = event.target.files;

            if (selectedFiles.length > 0) {
              const file = selectedFiles[0] as File;

              const mime = file.type;
              if (!mime.includes('image')) {
                return;
              }

              const fr = new FileReader();
              fr.onload = () => {
                files.push(fr.result as string);
              };
              fr.readAsDataURL(file);
            } else {
              console.log('No file selected.');
            }
          }}
        />
      </div>

      <Button class="w-fit" type="success" {formaction}>Post</Button>
    </div>
  </div>
</form>

<style lang="postcss">
  @reference '@/app.css';

  .main {
    @apply flex gap-2 p-4;
  }

  .editor {
    @apply min-h-24 w-full rounded-md border border-gray-700 p-4 focus:border-gray-300;
  }

  .editor.empty::before {
    content: attr(data-placeholder);
    @apply text-gray-500;
  }

  .media-viewer {
    @apply flex gap-4 overflow-x-scroll pb-2;
  }
</style>

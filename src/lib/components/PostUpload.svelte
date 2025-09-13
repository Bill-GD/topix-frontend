<script lang="ts">
  import { onMount } from 'svelte';
  import type { PostUploadProps } from './types';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import IconButton from './IconButton.svelte';
  import { ImageSizeLimit, VideoSizeLimit } from '../utils/constants';
  import { getReadableSize } from '../utils/helpers';

  let {
    userProfilePicture = '/images/default-user-profile-icon.jpg',
    formaction,
  }: PostUploadProps = $props();

  let inputContent = $state<string>('');
  let images = $state<string[]>([]);
  let video = $state<string>('');
  let errorText = $state<string>('');

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

    {#if images.length > 0}
      <div class="media-viewer scrollbar">
        {#each images as file, index (index)}
          <div class="relative">
            <IconButton
              class="absolute top-0 right-0"
              onclick={(ev) => {
                ev.preventDefault();
                images.splice(index, 1);
              }}
            >
              <Icon class="text-gray-500 hover:cursor-pointer hover:text-gray-300" type="close" />
            </IconButton>

            <img class="aspect-square h-30 w-30 rounded-md" src={file} alt="upload-image-{index}" />
            <input class="hidden" name="images" value={file} />
          </div>
        {/each}
      </div>
    {/if}

    {#if video !== ''}
      <div class="relative self-end">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video class="w-full max-w-md rounded-md" controls>
          <source src={video} type="video/mp4" />
        </video>

        <IconButton
          class="absolute top-0 right-0"
          onclick={(ev) => {
            ev.preventDefault();
            video = '';
          }}
        >
          <Icon class="text-gray-500 hover:cursor-pointer hover:text-gray-300" type="close" />
        </IconButton>

        <input class="hidden" name="video" value={video} />
      </div>
    {/if}

    <div class="flex justify-end gap-4">
      {#if errorText !== ''}
        <p class="self-center text-red-500">{errorText}</p>
      {/if}

      <div class="flex items-center">
        <label for="image-input">
          <Icon type="image" class="text-gray-500 hover:cursor-pointer hover:text-gray-300" />
        </label>
        <input
          class="hidden"
          type="file"
          id="image-input"
          accept="image/*"
          disabled={video !== ''}
          onchange={(event) => {
            const input = event.target as HTMLInputElement;
            const selectedFiles = input.files!;

            if (selectedFiles.length > 0) {
              const file = selectedFiles[0] as File;

              if (file.size > ImageSizeLimit) {
                errorText = `Max image size is ${getReadableSize(ImageSizeLimit)}`;
                return;
              }
              errorText = '';

              const fr = new FileReader();
              fr.onload = () => images.push(fr.result as string);
              fr.readAsDataURL(file);
            } else {
              console.log('No file selected.');
            }
          }}
        />
      </div>

      <div class="flex items-center">
        <label for="video-input">
          <Icon type="video" class="text-gray-500 hover:cursor-pointer hover:text-gray-300" />
        </label>
        <input
          class="hidden"
          type="file"
          id="video-input"
          accept="video/mp4"
          disabled={images.length > 0}
          onchange={(event) => {
            const input = event.target as HTMLInputElement;
            const selectedFiles = input.files!;

            if (selectedFiles.length > 0) {
              const file = selectedFiles[0] as File;

              if (file.size > VideoSizeLimit) {
                errorText = `Max video size is ${getReadableSize(VideoSizeLimit)}`;
                return;
              }
              errorText = '';

              const fr = new FileReader();
              fr.onload = () => {
                input.value = '';
                video = fr.result as string;
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

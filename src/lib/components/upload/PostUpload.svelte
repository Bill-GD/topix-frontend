<script lang="ts">
  import { onMount } from 'svelte';
  import { ImageSizeLimit, VideoSizeLimit } from '$lib/utils/constants';
  import { formResultToast, getReadableSize } from '$lib/utils/helpers';
  import type { PostUploadProps } from '$lib/components/types';
  import { getToaster } from '$lib/components/toast';
  import Button from '../button/Button.svelte';
  import IconButton from '../button/IconButton.svelte';
  import Icon from '../misc/Icon.svelte';
  import { enhance } from '$app/forms';

  let {
    tags,
    userPicture = '/images/default-user-profile-icon.jpg',
    formaction,
    placeholder = `What's happening?`,
    postCallback,
  }: PostUploadProps = $props();

  const toaster = getToaster();

  let inputContent = $state<string>('');
  let images = $state<{ file: File; url: string }[]>([]);
  let video = $state<{ file: File; url: string } | null>(null);
  let imageDisabled = $derived(video !== null);
  let videoDisabled = $derived(images.length > 0);
  let disablePost = $state<boolean>(false);

  onMount(() => {
    const editor = document.getElementById('editor')!;

    editor.addEventListener('input', () => {
      const trimmed = editor.innerText.trim();
      inputContent = trimmed.length > 0 ? editor.innerText : trimmed;
      editor.classList.toggle('empty', inputContent.length === 0);
    });

    document.getElementById('image-input')?.addEventListener('change', (ev) => {
      if (imageDisabled) return;
      images = [];

      const input = ev.target as HTMLInputElement;
      if (!input.files) return;

      const selectedFiles = input.files;
      for (const file of selectedFiles) {
        if (file.size > ImageSizeLimit) {
          toaster.addToast(`Max image size is ${getReadableSize(ImageSizeLimit)}`, 'error');
          return;
        }
        images.push({ file, url: URL.createObjectURL(file) });
      }
    });

    document.getElementById('video-input')?.addEventListener('change', (ev) => {
      if (videoDisabled) return;

      const input = ev.target as HTMLInputElement;
      if (!input.files) return;

      const selectedFiles = input.files;
      const file = selectedFiles[0] as File;

      if (file.size > VideoSizeLimit) {
        toaster.addToast(`Max video size is ${getReadableSize(VideoSizeLimit)}`, 'error');
        return;
      }
      if (video !== null) URL.revokeObjectURL(video.url);
      video = { file, url: URL.createObjectURL(file) };
    });
  });
</script>

<form
  class="main"
  method="post"
  enctype="multipart/form-data"
  onsubmit={() => (disablePost = true)}
  use:enhance={() => {
    return async ({ result, update }) => {
      await formResultToast(result, toaster);
      await update();

      inputContent = '';
      images = [];
      video = null;
      disablePost = false;
      (document.querySelector('#editor') as HTMLInputElement).innerHTML = '';
      (document.querySelector('#editor') as HTMLInputElement).classList.add('empty');
      (document.querySelector('#image-input') as HTMLInputElement).value = '';
      (document.querySelector('#video-input') as HTMLInputElement).value = '';
    };
  }}
>
  <img
    class="profile-picture-sm"
    src={userPicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class="flex w-full flex-col gap-4">
    <div
      id="editor"
      class="editor empty text-white"
      contenteditable
      role="textbox"
      aria-multiline="true"
      spellcheck="true"
      data-placeholder={placeholder}
    ></div>
    <textarea class="hidden" name="content" value={inputContent}></textarea>

    {#if images.length > 0}
      <div class="media-viewer scrollbar">
        {#each images as file, index (index)}
          <div class="relative">
            <IconButton
              class="absolute top-0 right-0"
              onclick={(ev) => {
                ev.preventDefault();
                URL.revokeObjectURL(images.splice(index, 1)[0].url);
              }}
            >
              <Icon class="text-gray-500 hover:cursor-pointer hover:text-gray-300" type="close" />
            </IconButton>

            <img
              class="aspect-square h-30 w-30 rounded-md"
              src={file.url}
              alt="upload-image-{index}"
            />
          </div>
        {/each}
      </div>
    {/if}

    {#if video !== null}
      <div class="relative self-end">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video class="w-full max-w-md rounded-md" controls>
          <source src={video.url} type="video/mp4" />
        </video>

        <IconButton
          class="absolute top-0 right-0"
          onclick={(ev) => {
            ev.preventDefault();
            URL.revokeObjectURL(video!.url);
            video = null;
          }}
        >
          <Icon class="text-gray-500 hover:cursor-pointer hover:text-gray-300" type="close" />
        </IconButton>
      </div>
    {/if}

    <div class="flex gap-4">
      {#if tags}
        <select
          class="rounded-md border-gray-700 bg-gray-950 text-white"
          name="tag-id"
          id="post-tag-select"
        >
          {#each tags as tag}
            <option disabled selected value hidden> -- choose tag -- </option>
            <option value={tag.id}>{tag.name}</option>
          {/each}
        </select>
      {/if}

      <div class="ml-auto flex items-center">
        <label for="image-input">
          <Icon
            class={[
              'text-gray-500',
              imageDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-gray-300',
            ]}
            type="image"
          />
        </label>
        <input
          class="hidden"
          type="file"
          id="image-input"
          name="images"
          accept="image/*"
          multiple
          disabled={imageDisabled}
        />
      </div>

      <div class="flex items-center" id="image-input-box">
        <label for="video-input">
          <Icon
            class={[
              'text-gray-500',
              videoDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:text-gray-300',
            ]}
            type="video"
          />
        </label>
        <input
          class="hidden"
          type="file"
          id="video-input"
          name="video"
          accept="video/mp4"
          disabled={videoDisabled}
        />
      </div>

      <Button
        class="w-fit"
        type="success"
        {formaction}
        disabled={disablePost}
        onclick={() => postCallback?.()}
      >
        Post
      </Button>
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

  .editor.empty::after {
    content: attr(data-placeholder);
    @apply text-gray-500;
  }

  .media-viewer {
    @apply flex gap-4 overflow-x-scroll pb-2;
  }
</style>

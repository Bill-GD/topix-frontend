<script lang="ts">
  import { enhance } from '$app/forms';
  import { getToaster } from '$lib/components/toast';
  import type { PostUploadProps } from '$lib/components/types';
  import { ImageSizeLimit, VideoSizeLimit } from '$lib/utils/constants';
  import { formResultToast, getReadableSize } from '$lib/utils/helpers';
  import { type Tag } from '$lib/utils/types';
  import { onMount } from 'svelte';
  import Button from '../button/Button.svelte';
  import IconButton from '../button/IconButton.svelte';
  import Flair from '../misc/Flair.svelte';
  import Icon from '../misc/Icon.svelte';
  import VisibilitySelector from '../misc/VisibilitySelector.svelte';
  import Modal from '../modal/Modal.svelte';
  import ModalBody from '../modal/ModalBody.svelte';
  import ModalFooter from '../modal/ModalFooter.svelte';
  import ModalHeader from '../modal/ModalHeader.svelte';

  let {
    class: className,
    userPicture = '/images/default-user-profile-icon.jpg',
    formaction,
    placeholder = `What's happening?`,
    tags,
    threadId,
    groupId,
    groupApproved = false,
    showVisibilitySelector = false,
    hideBox = false,
    postCallback,
  }: PostUploadProps = $props();

  const toaster = getToaster();

  let inputContent = $state<string>('');
  let images = $state<{ file: File; url: string }[]>([]);
  let video = $state<{ file: File; url: string } | null>(null);
  let imageDisabled = $derived(video !== null);
  let videoDisabled = $derived(images.length > 0);
  let disablePost = $state<boolean>(false);
  let showModal = $state<'tag' | null>(null);
  let chosenTag = $state<Tag | null>(null);
  let selectedTag = $state<Tag | null>(null);

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

  function hideModal() {
    showModal = null;
  }
</script>

<form
  class={['flex gap-2 p-4', !hideBox && 'rounded-lg bg-zinc-50 box-drop-shadow', className]}
  method="post"
  enctype="multipart/form-data"
  onsubmit={() => (disablePost = true)}
  use:enhance={() => {
    return async ({ result, update }) => {
      await formResultToast(result, toaster);
      await update({ reset: false });

      inputContent = '';
      images = [];
      video = selectedTag = chosenTag = null;
      disablePost = false;
      (document.querySelector('#editor') as HTMLInputElement).innerHTML = '';
      (document.querySelector('#editor') as HTMLInputElement).classList.add('empty');
      (document.querySelector('#image-input') as HTMLInputElement).value = '';
      (document.querySelector('#video-input') as HTMLInputElement).value = '';
    };
  }}
>
  <img
    class="hidden profile-picture-sm md:block"
    src={userPicture ?? '/images/default-user-profile-icon.jpg'}
    alt="profile"
  />

  <div class="flex w-full flex-col gap-4">
    <div
      id="editor"
      class="editor empty dark:text-white"
      contenteditable
      role="textbox"
      aria-multiline="true"
      spellcheck="true"
      data-placeholder={placeholder}
    ></div>
    <textarea name="content" value={inputContent} hidden readonly></textarea>

    {#if images.length > 0}
      <div class="flex flex-wrap gap-4 pb-2">
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

    <div class="flex items-center gap-4">
      {#if chosenTag}
        <button
          class="flex cursor-pointer items-center gap-2"
          onclick={(ev) => {
            ev.preventDefault();
            showModal = 'tag';
          }}
        >
          <input name="tag-id" type="number" value={chosenTag.id} hidden readonly />
          <Flair tag={chosenTag} />
          <Icon type="edit" size="sm" />
        </button>
      {:else if tags && tags.length > 0}
        <Button
          type="dark"
          outline
          onclick={(ev) => {
            ev.preventDefault();
            showModal = 'tag';
          }}
        >
          Choose tag
        </Button>
      {/if}

      {#if showVisibilitySelector}
        <VisibilitySelector />
      {/if}

      <div class="ml-auto flex items-center">
        <label for="image-input">
          <Icon
            class={[
              'text-gray-500',
              imageDisabled
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300',
            ]}
            type="image"
          />
        </label>
        <input
          type="file"
          id="image-input"
          name="images"
          accept="image/*"
          disabled={imageDisabled}
          multiple
          hidden
        />
      </div>

      <div class="flex items-center" id="image-input-box">
        <label for="video-input">
          <Icon
            class={[
              'text-gray-500',
              videoDisabled
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300',
            ]}
            type="video"
          />
        </label>
        <input
          type="file"
          id="video-input"
          name="video"
          accept="video/mp4"
          disabled={videoDisabled}
          hidden
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
    {#if groupId !== undefined}
      <input type="number" name="group-id" value={groupId} hidden readonly />
    {/if}
    {#if threadId !== undefined}
      <input type="number" name="thread-id" value={threadId} hidden readonly />
    {/if}
    <input type="checkbox" name="group-approved" checked={groupApproved} hidden readonly />
  </div>
</form>

<Modal class="md:w-fit" show={showModal === 'tag'} backdropCallback={hideModal}>
  <ModalHeader class="text-center">Select tag</ModalHeader>
  <ModalBody>
    <div class="flex flex-col gap-4">
      {#each tags! as tag}
        <div class="tag-input flex items-center gap-4">
          <input type="radio" id={`${tag.id}`} name="tag" oninput={() => (selectedTag = tag)} />
          <label for={`${tag.id}`}><Flair {tag} /></label>
        </div>
      {/each}
    </div>
  </ModalBody>
  <ModalFooter>
    <Button
      class="w-full"
      type="success"
      onclick={() => {
        hideModal();
        chosenTag = selectedTag;
      }}
    >
      Confirm
    </Button>
    <Button
      class="w-full"
      type="dark"
      onclick={() => {
        hideModal();
        selectedTag = null;
      }}
    >
      Cancel
    </Button>
    <Button
      class="w-full"
      type="dark"
      onclick={() => {
        hideModal();
        selectedTag = chosenTag = null;
      }}
    >
      Remove
    </Button>
  </ModalFooter>
</Modal>

<style lang="postcss">
  @reference '@/app.css';

  .editor {
    @apply min-h-24 w-full rounded-md border border-gray-700 p-4 focus:border-gray-300;
  }

  .editor.empty::after {
    content: attr(data-placeholder);
    @apply text-gray-500;
  }

  .tag-input {
    input {
      @apply rounded-md bg-zinc-50 transition-all duration-150 checked:border-2 checked:border-sky-500 checked:bg-sky-500 dark:bg-zinc-950;
    }

    * {
      @apply cursor-pointer;
    }

    &:hover {
      input {
        @apply not-checked:bg-zinc-300 dark:not-checked:bg-zinc-700;
      }
    }
  }
</style>

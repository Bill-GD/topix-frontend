import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Thread } from '$lib/utils/types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const data: { thread: Thread; posts: Post[] } = { thread: {} as Thread, posts: [] };

  const threadRes = await AxiosHandler.get(
    `/thread/${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!threadRes.success) {
    error(threadRes.status, { message: threadRes.message, status: threadRes.status });
  }
  data.thread = threadRes.data as unknown as Thread;

  const postRes = await AxiosHandler.get(
    `/post?threadId=${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!postRes.success) {
    error(postRes.status, { message: postRes.message, status: postRes.status });
  }
  data.posts = postRes.data as unknown as Post[];

  return data;
};

export const actions: Actions = {
  react: handleReaction,
  'delete-thread': async (event) => {
    const formData = await event.request.formData();
    const threadId = formData.get('thread-id');

    const res = await AxiosHandler.delete(
      `/thread/${threadId}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    redirect(303, `/home`);
  },
  'update-title': async (event) => {
    const formData = await event.request.formData();
    const newTitle = formData.get('new-title');

    const res = await AxiosHandler.patch(
      `/thread/${event.params.id}`,
      { title: newTitle },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: 'Title updated successfully' };
  },
  'add-post': async (event) => {
    const formData = await event.request.formData();
    const files: File[] = [];
    let urls: string[] = [];
    let type = 'image';
    const content = `${formData.get('content')}`.replaceAll('\r\n\r\n', '\n');

    if (formData.has('video')) {
      const vid = formData.get('video') as File;
      if (vid.size > 0) {
        type = 'video';
        files.push(vid);
      }
    } else if (formData.has('images')) {
      files.push(...(formData.getAll('images') as File[]).filter((f) => f.size > 0));
    }

    if (files.length <= 0 && content.length <= 0) {
      return fail(400, {
        success: false,
        message: 'Content must not be empty if no image or video uploaded.',
      });
    }

    if (files.length > 0) {
      const form = new FormData();
      files.forEach((f) => form.append('files', f));

      const fileRes = await AxiosHandler.post(
        '/file/upload',
        form,
        event.cookies.get(CookieName.accessToken),
        { 'Content-Type': 'multipart/form-data' },
      );
      if (!fileRes.success) {
        return fail(fileRes.status, { success: false, message: fileRes.message });
      }
      urls = fileRes.data as string[];
    }

    const dto = {
      type,
      content,
      mediaPaths: urls,
    };

    const res = await AxiosHandler.post(
      `/thread/${event.params.id}/post`,
      dto,
      event.cookies.get(CookieName.accessToken),
    );
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
  },
  'delete-post': async (event) => {
    const formData = await event.request.formData();
    const postId = formData.get('post-id');

    const res = await AxiosHandler.delete(
      `/post/${postId}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    // return { success: true, message: 'Post deleted successfully' };
    if (postId === event.params.id) redirect(303, '/home');
  },
};

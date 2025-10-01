import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Thread } from '$lib/utils/types';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const data: { thread: Thread; posts: Post[] } = { thread: {} as Thread, posts: [] };

  const threadRes = await AxiosHandler.get(
    `/thread/${params.threadId}`,
    cookies.get(CookieName.accessToken),
  );
  if (!threadRes.success) {
    error(threadRes.status, { message: threadRes.message, status: threadRes.status });
  }
  data.thread = threadRes.data as unknown as Thread;

  const postRes = await AxiosHandler.get(
    `/post?threadId=${params.threadId}`,
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
    redirect(303, `/groups/${event.params.id}`);
  },
  'update-title': async (event) => {
    const formData = await event.request.formData();
    const newTitle = formData.get('new-title');

    const res = await AxiosHandler.patch(
      `/thread/${event.params.threadId}`,
      { title: newTitle },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'add-post': async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const files: File[] = [];
    const content = `${formData.get('content')}`.replaceAll('\r\n\r\n', '\n');
    let type = 'image';

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

    const form = new FormData();
    form.append('type', type);
    form.append('content', content);
    // form.append('groupId', `${params.id}`); // comment out to fix with simlar issues later
    if (files.length > 0) files.forEach((f) => form.append('files', f));

    const res = await AxiosHandler.post(
      `/thread/${params.threadId}/post`,
      form,
      cookies.get(CookieName.accessToken),
      { 'Content-Type': 'multipart/form-data' },
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'delete-post': async (event) => {
    const formData = await event.request.formData();
    const postId = formData.get('post-id');

    const res = await AxiosHandler.delete(
      `/post/${postId}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

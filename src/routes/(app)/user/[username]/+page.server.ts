import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Thread, type User } from '$lib/utils/types';
import { type Actions, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const userRes = await AxiosHandler.get(
    `/user/${params.username}`,
    cookies.get(CookieName.accessToken),
  );
  if (!userRes.success) return error(404, { status: 404, message: 'User not found' });
  const user = userRes.data as User;

  const postsRes = await AxiosHandler.get(
    `/post?username=${user.username}`,
    cookies.get(CookieName.accessToken),
  );

  const threadsRes = await AxiosHandler.get(
    `/thread?username=${user.username}&size=5`,
    cookies.get(CookieName.accessToken),
  );

  return {
    user,
    posts: postsRes.data as unknown as Post[],
    threads: threadsRes.data as unknown as Thread[],
  };
};

export const actions: Actions = {
  'post-upload': async (event) => {
    const formData = await event.request.formData();
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
    if (files.length > 0) files.forEach((f) => form.append('files', f));

    const res = await AxiosHandler.post('/post', form, event.cookies.get(CookieName.accessToken), {
      'Content-Type': 'multipart/form-data',
    });
    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  react: handleReaction,
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
  'create-thread': async (event) => {
    const formData = await event.request.formData();
    const title = `${formData.get('thread-title')}`;

    if (title === null || title.length <= 0) {
      return fail(400, { success: false, message: 'Title can not be empty' });
    }

    const res = await AxiosHandler.post(
      '/thread',
      { title },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

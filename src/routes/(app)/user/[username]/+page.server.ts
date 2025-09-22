import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Thread, type User } from '$lib/utils/types';
import { error, fail, type Actions } from '@sveltejs/kit';
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

    const res = await AxiosHandler.post('/post', dto, event.cookies.get(CookieName.accessToken));
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
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
    return { success: true, message: 'Post deleted successfully' };
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
    return { success: true, message: 'Post deleted successfully' };
  },
};

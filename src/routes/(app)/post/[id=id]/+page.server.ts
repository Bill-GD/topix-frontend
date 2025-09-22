import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post } from '$lib/utils/types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const data: { post: Post; replies: Post[] } = { post: {} as Post, replies: [] };

  const postRes = await AxiosHandler.get(`/post/${params.id}`, cookies.get(CookieName.accessToken));
  if (!postRes.success) {
    error(postRes.status, { message: postRes.message, status: postRes.status });
  }
  data.post = postRes.data as unknown as Post;

  const repliesRes = await AxiosHandler.get(
    `/post?parentId=${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!repliesRes.success) {
    error(repliesRes.status, { message: repliesRes.message, status: repliesRes.status });
  }
  data.replies = repliesRes.data as unknown as Post[];

  return data;
};

export const actions: Actions = {
  react: handleReaction,
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
  reply: async (event) => {
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
      `/post/${event.params.id}/reply`,
      dto,
      event.cookies.get(CookieName.accessToken),
    );
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
  },
};

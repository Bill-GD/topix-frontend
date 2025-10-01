import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post } from '$lib/utils/types';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';
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
  reply: async ({ request, cookies, params }) => {
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
    form.append('approved', `${formData.has('group-approved')}`);
    if (formData.has('group-id')) form.append('groupId', `${formData.get('group-id')}`);
    if (files.length > 0) files.forEach((f) => form.append('files', f));

    const res = await AxiosHandler.post(
      `/post/${params.id}/reply`,
      form,
      cookies.get(CookieName.accessToken),
      { 'Content-Type': 'multipart/form-data' },
    );
    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

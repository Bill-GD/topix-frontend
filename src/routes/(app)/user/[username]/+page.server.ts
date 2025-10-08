import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { getPostUploadForm } from '$lib/utils/helpers';
import { CookieName, type Post, type Thread, type User } from '$lib/utils/types';
import { type Actions, error, fail, isActionFailure } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params, cookies }) => {
  const self = (await parent()).self;

  const userRes = await AxiosHandler.get(
    `/user/${params.username}`,
    cookies.get(CookieName.accessToken),
  );
  if (!userRes.success) return error(404, { status: 404, message: 'User not found' });
  const user = userRes.data as User;

  const postsRes = await AxiosHandler.get(
    `/post?username=${params.username}${self.username === params.username ? '&visibility=private' : ''}`,
    cookies.get(CookieName.accessToken),
  );

  const threadsRes = await AxiosHandler.get(
    `/thread?username=${user.username}&size=5${self.username === params.username ? '&visibility=private' : ''}`,
    cookies.get(CookieName.accessToken),
  );

  return {
    user,
    posts: postsRes.data as unknown as Post[],
    threads: threadsRes.data as unknown as Thread[],
  };
};

export const actions: Actions = {
  'post-upload': async ({ request, cookies }) => {
    const form = await getPostUploadForm(request);
    if (isActionFailure(form)) return form;

    const res = await AxiosHandler.post('/post', form, cookies.get(CookieName.accessToken), {
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
      { title, visibility: `${formData.get('visibility')}` },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

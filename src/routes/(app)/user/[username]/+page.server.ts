import { AxiosHandler, handlePostDeletion, handleReaction } from '$lib/utils/axios-handler';
import { getPostUploadForm } from '$lib/utils/helpers';
import { CookieName, type Group, type Post, type Thread, type User } from '$lib/utils/types';
import { type Actions, error, fail, isActionFailure } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params, cookies, url, fetch }) => {
  const self = (await parent()).self;
  const tab = url.searchParams.get('tab') ?? 'posts';

  const userRes = await AxiosHandler.get(
    `/user/${params.username}`,
    cookies.get(CookieName.accessToken),
  );
  if (!userRes.success) return error(userRes.status, userRes.message);
  const user = userRes.data as User;

  switch (tab) {
    case 'posts': {
      const res = await fetch(
        `/api/posts?username=${params.username}${self.username === params.username ? '&visibility=private' : ''}`,
      );
      return { user, posts: (await res.json()) as unknown as Post[] };
    }
    case 'threads': {
      const res = await fetch(
        `/api/threads?username=${user.username}${self.username === params.username ? '&visibility=private' : ''}`,
      );
      return { user, threads: (await res.json()) as unknown as Thread[] };
    }
    case 'groups': {
      const res = await fetch(`/api/groups?ownerId=${user.id}`);
      return { user, groups: (await res.json()) as unknown as Group[] };
    }
    default: {
      error(400, 'Unknown tab');
    }
  }
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
  'delete-post': handlePostDeletion,
  'create-thread': async ({ request, cookies }) => {
    const formData = await request.formData();
    const title = `${formData.get('thread-title')}`;

    if (title === null || title.length <= 0) {
      return fail(400, { success: false, message: 'Title can not be empty' });
    }

    const res = await AxiosHandler.post(
      '/thread',
      { title, visibility: `${formData.get('visibility')}` },
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  follow: async ({ request, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.post(
      `/user/${formData.get('user-id')}/follow`,
      undefined,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  unfollow: async ({ request, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.delete(
      `/user/${formData.get('user-id')}/follow`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Group, type Post, type Thread } from '$lib/utils/types';
import { type Actions, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies, params }) => {
  const self = (await parent()).self;
  if (self.username !== params.username) {
    error(403, 'Unauthorized');
  }

  switch (params.section) {
    case 'post': {
      const res = await AxiosHandler.get(
        `/post?username=${params.username}&visibility=hidden`,
        cookies.get(CookieName.accessToken),
      );

      if (!res.success) error(res.status, res.message);
      return { posts: res.data as unknown as Post[] };
    }
    case 'thread': {
      const res = await AxiosHandler.get(
        `/thread?username=${self.username}&visibility=hidden`,
        cookies.get(CookieName.accessToken),
      );
      if (!res.success) error(res.status, res.message);
      return { threads: res.data as unknown as Thread[] };
    }
    case 'group': {
      const res = await AxiosHandler.get(
        `/group?ownerId=${self.id}&hidden=true`,
        cookies.get(CookieName.accessToken),
      );
      if (!res.success) error(res.status, res.message);
      return { groups: res.data as unknown as Group[] };
    }
  }
};

export const actions: Actions = {
  react: handleReaction,
  'delete-post': async ({ request, cookies }) => {
    const formData = await request.formData();
    const postId = formData.get('post-id');

    const res = await AxiosHandler.delete(`/post/${postId}`, cookies.get(CookieName.accessToken));

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Thread } from '$lib/utils/types';
import { type Actions, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
  const tab = url.searchParams.get('tab') ?? 'new';

  switch (tab) {
    case 'new': {
      const postRes = await AxiosHandler.get('/post', cookies.get(CookieName.accessToken));
      if (!postRes.success)
        error(postRes.status, { status: postRes.status, message: postRes.message });

      const threadRes = await AxiosHandler.get('/thread', cookies.get(CookieName.accessToken));
      if (!threadRes.success)
        error(threadRes.status, { status: threadRes.status, message: threadRes.message });

      return {
        posts: postRes.data as unknown as Post[],
        threads: threadRes.data as unknown as Thread[],
      };
    }

    case 'following': {
      break;
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

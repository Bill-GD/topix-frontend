import { AxiosHandler, handlePostDeletion, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Thread } from '$lib/utils/types';
import { type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url, fetch }) => {
  const tab = url.searchParams.get('tab') ?? 'new';

  switch (tab) {
    case 'new': {
      const res = await fetch('/api/posts');

      const threadRes = await AxiosHandler.get('/thread', cookies.get(CookieName.accessToken));
      if (!threadRes.success) error(threadRes.status, threadRes.message);

      return {
        posts: (await res.json()) as unknown as Post[],
        threads: threadRes.data as unknown as Thread[],
      };
    }
    case 'following': {
      const res = await fetch('/api/posts?following');
      return { posts: (await res.json()) as unknown as Post[] };
    }
    default: {
      error(404, 'Unknown tab');
    }
  }
};

export const actions: Actions = {
  react: handleReaction,
  'delete-post': handlePostDeletion,
};

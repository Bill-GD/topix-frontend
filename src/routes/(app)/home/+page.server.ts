import { handlePostDeletion, handleReaction } from '$lib/utils/axios-handler';
import { type Post } from '$lib/utils/types';
import { type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
  const tab = url.searchParams.get('tab') ?? 'new';

  switch (tab) {
    case 'new': {
      const res = await fetch('/api/posts');
      return {
        posts: (await res.json()) as Post[],
        endOfList: res.headers.get('x-end-of-list') === 'true',
      };
    }
    case 'following': {
      const res = await fetch('/api/posts?following');
      return {
        posts: (await res.json()) as Post[],
        endOfList: res.headers.get('x-end-of-list') === 'true',
      };
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

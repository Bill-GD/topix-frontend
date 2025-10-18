import { AxiosHandler, handlePostDeletion, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Group, type Post, type Thread } from '$lib/utils/types';
import { type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies, params, url }) => {
  const tab = url.searchParams.get('tab') ?? 'posts';
  const self = (await parent()).self;
  if (self.username !== params.username) {
    error(403, 'Unauthorized');
  }

  switch (tab) {
    case 'posts': {
      const res = await AxiosHandler.get(
        `/post?username=${self.username}&visibility=hidden`,
        cookies.get(CookieName.accessToken),
      );

      if (!res.success) error(res.status, res.message);
      return { posts: res.data as unknown as Post[] };
    }
    case 'threads': {
      const res = await AxiosHandler.get(
        `/thread?username=${self.username}&visibility=hidden`,
        cookies.get(CookieName.accessToken),
      );
      if (!res.success) error(res.status, res.message);
      return { threads: res.data as unknown as Thread[] };
    }
    case 'groups': {
      const res = await AxiosHandler.get(
        `/group?ownerId=${self.id}&hidden=true`,
        cookies.get(CookieName.accessToken),
      );
      if (!res.success) error(res.status, res.message);
      return { groups: res.data as unknown as Group[] };
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

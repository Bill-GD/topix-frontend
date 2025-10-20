import type { Post } from '$lib/utils/types';
import { getFeedSearchParams } from '@/lib/utils/helpers';
import { type Actions, fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const searchString = `${formData.get('search-string')}`;

    const [params, finalSearchString] = getFeedSearchParams(searchString);

    if (finalSearchString.length <= 0) {
      return fail(400, { success: false, message: 'No search query found' });
    }

    const res = await fetch(`/api/posts?${params}`);
    return {
      searchString: finalSearchString,
      posts: (await res.json()) as unknown as Post[],
      endOfList: res.headers.get('x-end-of-list') === 'true',
    };
  },
};

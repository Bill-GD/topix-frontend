import type { Post } from '$lib/utils/types';
import { getFeedSearchParams } from '@/lib/utils/helpers';
import { type Actions, fail } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const searchString = `${formData.get('search-string')}`;

    const paramRes = getFeedSearchParams(searchString);

    if (!paramRes.success) {
      return fail(400, { success: false, message: paramRes.message });
    }
    const [params, finalSearchString] = paramRes.data!;

    const res = await fetch(`/api/posts?${params}`);
    return {
      searchString: finalSearchString,
      posts: (await res.json()) as unknown as Post[],
      endOfList: res.headers.get('x-end-of-list') === 'true',
    };
  },
};

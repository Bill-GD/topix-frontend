import { getFeedSearchParams } from '$lib/utils/helpers';
import type { Post } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
  const searchString = url.searchParams.get('q');
  if (!searchString) return { posts: [] as Post[], endOfList: true };

  const res = await fetch(`/api/posts?${getFeedSearchParams(searchString)}`);
  return {
    posts: (await res.json()) as Post[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
};

import type { ChatChannel } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const searchString = url.searchParams.get('q');
  const res = await fetch(`/api/chat${searchString ? `?username=${searchString}` : ''}`);
  return {
    channels: (await res.json()) as ChatChannel[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
};

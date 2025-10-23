import type { ChatChannel } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/chat');
  return {
    channels: (await res.json()) as ChatChannel[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
};

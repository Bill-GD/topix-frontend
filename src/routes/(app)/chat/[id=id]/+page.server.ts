import { type ChatChannel, type ChatMessage, CookieName } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, fetch }) => {
  const channelRes = await fetch(`/api/chat?id=${params.id}`);
  const messagesRes = await fetch(`/api/chat?id=${params.id}&messages`);
  return {
    channel: (await channelRes.json()) as ChatChannel,
    messages: (await messagesRes.json()) as ChatMessage[],
    endOfList: messagesRes.headers.get('x-end-of-list') === 'true',
    token: cookies.get(CookieName.accessToken),
  };
};

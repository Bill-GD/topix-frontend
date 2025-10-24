import { AxiosHandler } from '$lib/utils/axios-handler';
import { type ChatChannel, type ChatMessage, CookieName } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, fetch }) => {
  const channelRes = await fetch(`/api/chat?id=${params.id}`);
  const messagesRes = await fetch(`/api/chat?id=${params.id}&messages&timestamp=${Date.now()}`);
  return {
    channel: (await channelRes.json()) as ChatChannel,
    messages: (await messagesRes.json()) as ChatMessage[],
    endOfList: messagesRes.headers.get('x-end-of-list') === 'true',
    token: cookies.get(CookieName.accessToken),
  };
};

export const actions: Actions = {
  'delete-channel': async ({ params, cookies }) => {
    const res = await AxiosHandler.delete(
      `/chat/${params.id}`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    redirect(303, '/chat');
  },
};

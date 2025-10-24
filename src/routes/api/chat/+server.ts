import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
  const channelId = url.searchParams.get('id') ?? '';
  const messages = url.searchParams.has('messages') && channelId !== '' ? '/messages' : '';

  url.searchParams.delete('id');
  url.searchParams.delete('messages');

  const res = await AxiosHandler.get(
    `/chat/${channelId}${messages}${url.search}`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) error(res.status, res.message);

  return json(res.data, {
    headers: {
      'x-end-of-list': res.headers['x-end-of-list'],
    },
  });
}

export async function POST({ request, url, cookies }) {
  const channel = url.searchParams.has('channel') ? '/channel' : '';

  const res = await AxiosHandler.post(
    `/chat${channel}`,
    JSON.parse(await request.text()),
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) error(res.status, res.message);

  return json(res.data);
}

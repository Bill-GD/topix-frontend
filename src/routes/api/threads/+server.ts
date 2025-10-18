import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
  const threadId = url.searchParams.get('id') ?? '';

  url.searchParams.delete('id');

  const res = await AxiosHandler.get(
    `/thread/${threadId}${url.search}`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) error(res.status, res.message);

  return json(res.data);
}

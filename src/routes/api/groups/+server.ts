import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
  const groupId = url.searchParams.get('id') ?? '';
  const members = url.searchParams.has('members') ? '/members' : '';

  url.searchParams.delete('id');
  url.searchParams.delete('members');

  const res = await AxiosHandler.get(
    `/group/${groupId}${members}${url.search}`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) error(res.status, res.message);

  return json(res.data, {
    headers: {
      'x-end-of-list': res.headers['x-end-of-list'],
    },
  });
}

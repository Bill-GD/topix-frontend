import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
  const following = url.searchParams.has('following') ? '/following' : '';
  url.searchParams.delete('following');

  const res = await AxiosHandler.get(
    `/post${following}${url.search}`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) error(res.status, res.message);

  return json(res.data);
}

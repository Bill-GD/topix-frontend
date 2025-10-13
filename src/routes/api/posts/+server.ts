import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies, url }) {
  const page = url.searchParams.get('page') ?? 1;

  const res = await AxiosHandler.get(
    `/post${url.searchParams.has('following') ? '/following' : ''}?page=${page}`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) {
    error(res.status, { status: res.status, message: res.message });
  }
  return json(res.data);
}

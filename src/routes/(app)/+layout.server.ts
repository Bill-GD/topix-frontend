import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { checkLogin } from '@/lib/utils/helpers';
import { AxiosHandler } from '@/lib/utils/axios-handler';
import { CookieName, type User } from '@/lib/utils/types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const loggedIn = await checkLogin(cookies);
  if (!loggedIn) redirect(303, '/login');

  const res = await AxiosHandler.get('/user/me', cookies.get(CookieName.accessToken));
  return { self: res.data as User };
};

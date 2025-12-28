import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type CurrentUser } from '$lib/utils/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const res = await AxiosHandler.get('/user/me', cookies.get(CookieName.accessToken));
  if (!res.success) error(res.status, res.message);

  const self = res.data as CurrentUser;
  if (self.role !== 'admin') return error(403, 'User is not authorized to access this page');
  return { self };
};

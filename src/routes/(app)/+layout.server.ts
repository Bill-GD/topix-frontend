import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AxiosHandler } from '@/lib/utils/axios-handler';
import { CookieName, type User } from '@/lib/utils/types';
import { deleteTokens } from '@/lib/utils/helpers';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (!locals.hasAT) redirect(303, '/login');

  const res = await AxiosHandler.get('/user/me', cookies.get(CookieName.accessToken));
  if (res.success) return { self: res.data as User };

  if (res.message.toLowerCase().includes('invalid signature')) {
    deleteTokens(cookies);
  }
  redirect(303, '/login');
};

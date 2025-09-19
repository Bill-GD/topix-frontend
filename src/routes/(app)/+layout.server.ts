import { AxiosHandler } from '$lib/utils/axios-handler';
import { deleteCookies } from '$lib/utils/helpers';
import { CookieName, type CurrentUser } from '$lib/utils/types';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  if (!locals.hasAT) redirect(303, '/login');

  if (cookies.get(CookieName.currentUser) !== undefined) {
    return { self: JSON.parse(cookies.get(CookieName.currentUser)!) as CurrentUser };
  }

  const res = await AxiosHandler.get('/user/me', cookies.get(CookieName.accessToken));
  if (res.success) {
    cookies.set(CookieName.currentUser, JSON.stringify(res.data), {
      path: '/',
      maxAge: 3600,
    });
    return { self: res.data as CurrentUser };
  }

  if (res.message.toLowerCase().includes('invalid signature')) {
    deleteCookies(cookies);
    redirect(303, '/login');
  }
  error(503, { status: 500, message: 'Server is down.' });
};

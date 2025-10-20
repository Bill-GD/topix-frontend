import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type CurrentUser } from '$lib/utils/types';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const currentUserCookie = cookies.get(CookieName.currentUser);
  if (currentUserCookie && currentUserCookie.trim() !== '') {
    return { self: JSON.parse(currentUserCookie) as CurrentUser };
  }

  const res = await AxiosHandler.get('/user/me', cookies.get(CookieName.accessToken));
  if (res.success) {
    cookies.set(CookieName.currentUser, JSON.stringify(res.data), {
      path: '/',
      maxAge: 3600,
    });
    return { self: res.data as CurrentUser };
  }

  error(res.status, res.message);
};

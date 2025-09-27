import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { deleteCookies } from '$lib/utils/helpers';

export const load: LayoutServerLoad = async ({ locals, cookies, route }) => {
  if (!locals.hasAT) {
    if (!locals.hasRT) {
      if (route.id?.includes('(auth)')) return;
      redirect(303, '/login');
    }

    const res = await AxiosHandler.post('/auth/refresh', {}, cookies.get(CookieName.refreshToken));
    if (res.success) {
      const resObject = res.data as Record<string, string>;
      cookies.set(CookieName.accessToken, `${resObject['token']}`, {
        path: '/',
        httpOnly: false,
        maxAge: Number(resObject['time']),
      });
      locals.hasAT = true;
      redirect(303, '/home');
    }

    if (res.message.toLowerCase().includes('invalid signature')) {
      deleteCookies(cookies);
      redirect(303, '/login');
    }

    error(res.status, { message: res.message, status: res.status });
  }

  if (locals.hasAT && !route.id?.includes('(app)')) redirect(303, '/home');
};

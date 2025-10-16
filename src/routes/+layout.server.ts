import { AxiosHandler } from '$lib/utils/axios-handler';
import { deleteCookies } from '$lib/utils/helpers';
import { CookieName } from '$lib/utils/types';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies, route, url }) => {
  if (!locals.hasAT) {
    if (!locals.hasRT) {
      if (route.id?.includes('(auth)')) return;
      redirect(303, '/login');
    }

    const res = await AxiosHandler.post(
      '/auth/refresh',
      undefined,
      cookies.get(CookieName.refreshToken),
    );
    if (!res.success) error(res.status, res.message);

    if (res.message.toLowerCase().includes('invalid signature')) {
      deleteCookies(cookies);
      redirect(303, '/login');
    }

    const resObject = res.data as Record<string, string>;
    cookies.set(CookieName.accessToken, `${resObject['token']}`, {
      path: '/',
      httpOnly: false,
      maxAge: Number(resObject['time']),
    });
    locals.hasAT = true;
    if (!route.id?.includes('(app)')) redirect(303, '/home');
  }

  if (locals.hasAT && (url.pathname === '/' || route.id?.includes('(auth)'))) {
    redirect(303, '/home');
  }
};

import { AxiosHandler } from '$lib/utils/axios-handler';
import { capitalize } from '$lib/utils/helpers';
import { CookieName } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();

    const dto = {
      username: `${formData.get('username')}`,
      password: `${formData.get('password')}`,
    };

    for (const v of Object.values(dto)) {
      if (v.length <= 0) {
        return fail(400, { success: false, message: 'All fields must not be empty.' });
      }
    }

    const res = await AxiosHandler.post('/auth/login', dto);
    if (!res.success) {
      let message = res.message;
      if (message.toLowerCase().includes('exception')) {
        if (res.error instanceof Array) message = capitalize(res.error[0]);
        if (typeof res.error === 'string') message = res.error;
      }
      return fail(res.status, { success: false, message });
    }

    const resObject = res.data as Record<string, string>;

    cookies.set(CookieName.accessToken, `${resObject['accessToken']}`, {
      path: '/',
      httpOnly: false,
      maxAge: Number(resObject['atTime']),
    });
    cookies.set(CookieName.refreshToken, `${resObject['refreshToken']}`, {
      path: '/',
      httpOnly: false,
      maxAge: Number(resObject['rtTime']),
    });

    redirect(303, '/home');
  },
};

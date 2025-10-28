import { ENABLE_EMAIL_VERIFICATION } from '$env/static/public';
import { AxiosHandler } from '$lib/utils/axios-handler';
import { capitalize } from '$lib/utils/helpers';
import { CookieName } from '$lib/utils/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  let email = '',
    username = '';

  if (url.searchParams.has('oauth') && cookies.get(CookieName.oauthUserInfo) !== undefined) {
    const userInfo = JSON.parse(cookies.get(CookieName.oauthUserInfo)!);

    email = userInfo.email;
    username = (userInfo.name as string).toLowerCase().replaceAll(' ', '_');
  }
  return { email, username };
};

export const actions: Actions = {
  default: async ({ request, url, cookies }) => {
    if (ENABLE_EMAIL_VERIFICATION !== 'true' && !url.searchParams.has('oauth')) {
      return fail(410, {
        success: false,
        message: 'Normal email registration is currently disabled.',
      });
    }

    const formData = await request.formData();

    const dto: {
      email: string;
      username: string;
      password: string;
      confirmPassword: string;
      verified?: string;
      profilePictureUrl?: string;
    } = {
      email: `${formData.get('email')}`,
      username: `${formData.get('username')}`,
      password: `${formData.get('password')}`,
      confirmPassword: `${formData.get('confirm-password')}`,
    };

    // prevents client tampering
    if (url.searchParams.has('oauth') && cookies.get(CookieName.oauthUserInfo) !== undefined) {
      const userInfo = JSON.parse(cookies.get(CookieName.oauthUserInfo)!);
      dto.email = userInfo.email;
      dto.username = (userInfo.name as string).toLowerCase().replaceAll(' ', '_');
      dto.verified = `true`;
      dto.profilePictureUrl = userInfo.picture;
    }

    for (const v of Object.values(dto)) {
      if (v && v.length <= 0) {
        return fail(400, {
          success: false,
          message: 'All fields must not be empty.',
        });
      }
    }

    const emailRegex =
      /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/;

    if (!RegExp(emailRegex).test(dto.email)) {
      return fail(400, { success: false, message: 'Email format is invalid.' });
    }

    const res = await AxiosHandler.post('/auth/register', dto);
    if (!res.success) {
      let message = res.message;
      if (res.message.toLowerCase().includes('exception')) {
        if (res.error instanceof Array) message = capitalize(res.error[0]);
        if (typeof res.error === 'string') message = res.error;
      }
      return fail(res.status, { success: false, message });
    }

    if (url.searchParams.has('oauth')) {
      cookies.delete(CookieName.oauthUserInfo, { path: '/' });
      return redirect(303, '/login');
    }
    return redirect(303, `/verify/${(res.data as Record<string, string>)['id']}`);
  },
};

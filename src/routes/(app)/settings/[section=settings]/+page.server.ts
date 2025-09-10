import { AxiosHandler } from '@/lib/utils/axios-handler';
import { deleteTokens } from '@/lib/utils/helpers';
import { CookieName } from '@/lib/utils/types';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  'update-account': async (event) => {
    const formData = await event.request.formData();
    const dto = {
      username: formData.get('username'),
    };

    const res = await AxiosHandler.patch(
      `/user/me`,
      dto,
      event.cookies.get(CookieName.accessToken),
    );
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
  },
  'update-profile': async (event) => {
    const formData = await event.request.formData();
    const dto = {
      displayName: formData.get('display-name'),
      description: formData.get('description'),
    };

    const res = await AxiosHandler.patch(
      `/user/me`,
      dto,
      event.cookies.get(CookieName.accessToken),
    );
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
  },
  'delete-account': async (event) => {
    const formData = await event.request.formData();

    const passwordCheckRes = await AxiosHandler.post(
      '/auth/password-check',
      {
        password: formData.get('password'),
      },
      event.cookies.get(CookieName.accessToken),
    );

    if (!passwordCheckRes.success) {
      return fail(passwordCheckRes.status, { success: false, message: passwordCheckRes.message });
    }

    const res = await AxiosHandler.delete(
      `/user/${formData.get('username')}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) fail(res.status, { success: false, message: res.message });
    // return { success: true, message: 'Saved successfully!' };
    deleteTokens(event.cookies);
    return redirect(303, '/');
  },
};

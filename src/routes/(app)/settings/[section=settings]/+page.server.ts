import { AxiosHandler } from '@/lib/utils/axios-handler';
import { CookieName } from '@/lib/utils/types';
import { fail, type Actions } from '@sveltejs/kit';

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
    const res = await AxiosHandler.delete(
      `/user/${formData.get('username')}`,
      event.cookies.get(CookieName.accessToken),
    );
    if (res.success) return { success: true, message: 'Saved successfully!' };
    fail(res.status, res.message);
  },
};

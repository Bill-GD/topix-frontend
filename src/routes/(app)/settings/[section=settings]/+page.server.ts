import { AxiosHandler } from '$lib/utils/axios-handler';
import { dataUrlToFile, deleteCookies } from '$lib/utils/helpers';
import { CookieName } from '$lib/utils/types';
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

    if (!res.success) return fail(res.status, { success: false, message: res.message });

    event.cookies.delete(CookieName.currentUser, { path: '/' });
    return { success: true, message: 'Saved successfully!' };
  },
  'update-profile': async (event) => {
    const formData = await event.request.formData();
    let dto: {
      displayName: FormDataEntryValue | null;
      description: FormDataEntryValue | null;
      profilePicture?: string;
    } = {
      displayName: formData.get('display-name'),
      description: formData.get('description'),
    };

    if (formData.get('profile-picture') !== '' && formData.get('profile-picture-name') !== '') {
      const form = new FormData();
      form.append('files', dataUrlToFile(`${formData.get('profile-picture')}`));

      const res = await AxiosHandler.post(
        '/file/upload',
        form,
        event.cookies.get(CookieName.accessToken),
        { 'Content-Type': 'multipart/form-data' },
      );

      if (!res.success) return fail(res.status, { success: false, message: res.message });
      dto = { ...dto, profilePicture: (res.data as string[])[0] };
    }

    const res = await AxiosHandler.patch(
      `/user/me`,
      dto,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });

    event.cookies.delete(CookieName.currentUser, { path: '/' });
    return { success: true, message: 'Saved successfully!' };
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
    deleteCookies(event.cookies);
    redirect(303, '/');
  },
};

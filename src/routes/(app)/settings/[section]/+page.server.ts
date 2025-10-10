import { AxiosHandler } from '$lib/utils/axios-handler';
import { dataUrlToFile, deleteCookies } from '$lib/utils/helpers';
import { CookieName, type CurrentUser, type User } from '$lib/utils/types';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies }) => {
  let currentUsername: string;

  const currentUserCookie = cookies.get(CookieName.currentUser);
  if (currentUserCookie && currentUserCookie.trim() !== '') {
    currentUsername = (JSON.parse(currentUserCookie) as CurrentUser).username;
  } else {
    currentUsername = (await parent()).self.username;
  }

  const res = await AxiosHandler.get(
    `/user/${currentUsername}`,
    cookies.get(CookieName.accessToken),
  );

  if (res.success) return { self: res.data as User };
  error(res.status, { status: res.status, message: res.message });
};

export const actions: Actions = {
  'update-account': async (event) => {
    const formData = await event.request.formData();
    const newUsername = formData.get('username')?.toString();

    if (!newUsername || newUsername.length <= 0) {
      return fail(400, { success: false, message: 'New username is not valid.' });
    }

    const res = await AxiosHandler.patch(
      `/user/me`,
      { username: newUsername },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });

    event.cookies.delete(CookieName.currentUser, { path: '/' });
    return { success: true, message: 'Saved successfully!' };
  },
  'update-profile': async ({ request, cookies }) => {
    const formData = await request.formData();
    const form = new FormData();
    if (formData.has('display-name')) form.append('displayName', `${formData.get('display-name')}`);
    if (formData.has('description')) form.append('description', `${formData.get('description')}`);

    if (formData.get('profile-picture') !== '') {
      form.append('profilePicture', dataUrlToFile(`${formData.get('profile-picture')}`));
    }

    const res = await AxiosHandler.patch(`/user/me`, form, cookies.get(CookieName.accessToken), {
      'Content-Type': 'multipart/form-data',
    });

    if (!res.success) return fail(res.status, { success: false, message: res.message });

    cookies.delete(CookieName.currentUser, { path: '/' });
    return { success: true, message: 'Saved successfully!' };
  },
  'delete-account': async (event) => {
    const formData = await event.request.formData();

    const passwordCheckRes = await AxiosHandler.post(
      '/auth/password-check',
      { password: formData.get('password') },
      event.cookies.get(CookieName.accessToken),
    );

    if (!passwordCheckRes.success) {
      return fail(passwordCheckRes.status, { success: false, message: passwordCheckRes.message });
    }

    const res = await AxiosHandler.delete(
      `/user/${(JSON.parse(event.cookies.get(CookieName.currentUser)!) as CurrentUser).username}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    deleteCookies(event.cookies);
    redirect(303, '/');
  },
};

import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type User } from '$lib/utils/types';
import { type Actions, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const res = await AxiosHandler.get(`/user`, cookies.get(CookieName.accessToken));

  if (!res.success) return error(res.status, res.message);

  return { users: res.data as unknown as User[] };
};

export const actions: Actions = {
  'delete-account': async (event) => {
    const formData = await event.request.formData();

    const res = await AxiosHandler.delete(
      `/user/${formData.get('username')}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

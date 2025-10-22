import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type User } from '$lib/utils/types';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const searchString = url.searchParams.get('q');
  const res = await fetch(`/api/users${searchString ? `?name=${searchString}` : ''}`);
  return {
    users: (await res.json()) as unknown as User[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
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

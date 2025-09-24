import type { PageServerLoad } from './$types';
import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type User } from '$lib/utils/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const res = await AxiosHandler.get(`/user`, cookies.get(CookieName.accessToken));

  if (!res.success) return error(res.status, { status: res.status, message: res.message });

  return {
    users: res.data as unknown as User[],
  };
};

import { AxiosHandler } from '@/lib/utils/axios-handler';
import type { PageServerLoad } from './$types';
import { CookieName, type User } from '@/lib/utils/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params, cookies }) => {
  const parentData = await parent();

  if (parentData.self.username === params.username) {
    return { user: parentData.self };
  }

  const res = await AxiosHandler.get(
    `/user/${params.username}`,
    cookies.get(CookieName.accessToken),
  );
  if (res.success) return { user: res.data as User };
  error(404, { status: 404, message: 'User not found' });
};

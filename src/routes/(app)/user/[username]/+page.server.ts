import { AxiosHandler } from '@/lib/utils/axios-handler';
import type { PageServerLoad } from './$types';
import { CookieName, type User } from '@/lib/utils/types';

export const load: PageServerLoad = async ({ parent, params, cookies }) => {
  const parentData = await parent();

  if (parentData.self.username === params.username) {
    return { user: parentData.self };
  }

  const { data: user } = await AxiosHandler.get(
    `/user/${params.username}`,
    cookies.get(CookieName.accessToken),
  );
  return { user: user as User };
};

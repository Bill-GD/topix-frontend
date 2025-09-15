import { AxiosHandler } from '@/lib/utils/axios-handler';
import type { PageServerLoad } from './$types';
import { CookieName, type Post, type User } from '@/lib/utils/types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params, cookies }) => {
  const parentData = await parent();
  let user: User | null = null;

  if (parentData.self.username === params.username) {
    user = parentData.self;
  }

  if (!user) {
    const userRes = await AxiosHandler.get(
      `/user/${params.username}`,
      cookies.get(CookieName.accessToken),
    );
    if (userRes.success) return error(404, { status: 404, message: 'User not found' });
    user = userRes.data as User;
  }

  const postsRes = await AxiosHandler.get(
    `/user/${user.username}/posts`,
    cookies.get(CookieName.accessToken),
  );

  return {
    user,
    posts: postsRes.data as unknown as Post[],
  };
};

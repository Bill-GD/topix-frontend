import { CookieName, type Post } from '@/lib/utils/types';
import type { PageServerLoad } from './$types';
import { AxiosHandler } from '@/lib/utils/axios-handler';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const postsRes = await AxiosHandler.get(
    `/post/${params.id}`,
    cookies.get(CookieName.accessToken),
  );

  if (postsRes.success) {
    return { post: postsRes.data as unknown as Post };
  }

  error(postsRes.status, { message: postsRes.message, status: postsRes.status });
};

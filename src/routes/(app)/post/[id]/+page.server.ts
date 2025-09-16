import { CookieName, type Post } from '@/lib/utils/types';
import type { PageServerLoad } from './$types';
import { AxiosHandler } from '@/lib/utils/axios-handler';
import { error, type Actions } from '@sveltejs/kit';

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

export const actions: Actions = {
  react: async (event) => {
    const formData = await event.request.formData();
    console.log(formData);
  },
};

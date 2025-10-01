import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type Post } from '$lib/utils/types';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const res = await AxiosHandler.get(
    `/post?groupId=${params.id}&accepted=false`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) {
    error(res.status, { status: res.status, message: res.message });
  }

  return {
    posts: res.data as unknown as Post[],
  };
};

export const actions: Actions = {
  'accept-post': async ({ request, params, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.post(
      `/group/${params.id}/post/${formData.get('post-id')}`,
      undefined,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'remove-post': async ({ request, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.delete(
      `/post/${formData.get('post-id')}`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

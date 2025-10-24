import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type Post } from '$lib/utils/types';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const res = await fetch(`/api/posts?groupId=${params.id}&threadId=null&accepted=false`);

  return {
    posts: (await res.json()) as Post[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
};

export const actions: Actions = {
  'approve-post': async ({ request, params, cookies }) => {
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

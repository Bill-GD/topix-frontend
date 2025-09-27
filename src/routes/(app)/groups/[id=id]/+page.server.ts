import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type Group, type Post } from '$lib/utils/types';
import { dataUrlToFile } from '$lib/utils/helpers';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const groupRes = await AxiosHandler.get(
    `/group/${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!groupRes.success) {
    error(groupRes.status, { status: groupRes.status, message: groupRes.message });
  }

  const postsRes = await AxiosHandler.get(
    `/post?groupId=${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!postsRes.success) {
    error(postsRes.status, { status: postsRes.status, message: postsRes.message });
  }

  return {
    group: groupRes.data as unknown as Group,
    posts: postsRes.data as unknown as Post[],
  };
};

export const actions: Actions = {
  // 'create-group': async (event) => {
  //   const formData = await event.request.formData();
  //   const groupName = formData.get('group-name');
  //   if (!groupName || groupName === '') {
  //     return fail(400, { success: false, message: 'Group name must not be empty.' });
  //   }
  //   const form = new FormData();
  //   form.append('name', `${groupName}`);
  //   if (formData.get('group-banner') !== '') {
  //     form.append('banner', dataUrlToFile(`${formData.get('group-banner')}`));
  //   }
  //   const res = await AxiosHandler.post('/group', form, event.cookies.get(CookieName.accessToken), {
  //     'Content-Type': 'multipart/form-data',
  //   });
  //   if (!res.success) return fail(res.status, { success: false, message: res.message });
  //   return { success: true, message: res.message };
  // },
};

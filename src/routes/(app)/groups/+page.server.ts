import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type Group } from '$lib/utils/types';
import { dataUrlToFile } from '$lib/utils/helpers';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const res = await AxiosHandler.get('/group', cookies.get(CookieName.accessToken));
  if (!res.success) error(res.status, { status: res.status, message: res.message });
  return {
    groups: res.data as unknown as Group[],
  };
};

export const actions: Actions = {
  'create-group': async (event) => {
    const formData = await event.request.formData();

    const groupName = formData.get('group-name');

    if (!groupName || groupName === '') {
      return fail(400, { success: false, message: 'Group name must not be empty.' });
    }

    const form = new FormData();
    form.append('name', `${groupName}`);

    if (formData.get('group-banner') !== '') {
      form.append('banner', dataUrlToFile(`${formData.get('group-banner')}`));
    }

    const res = await AxiosHandler.post('/group', form, event.cookies.get(CookieName.accessToken), {
      'Content-Type': 'multipart/form-data',
    });

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

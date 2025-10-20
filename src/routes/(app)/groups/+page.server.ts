import { AxiosHandler } from '$lib/utils/axios-handler';
import { dataUrlToFile } from '$lib/utils/helpers';
import { CookieName, type Group } from '$lib/utils/types';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/groups');
  return {
    groups: (await res.json()) as unknown as Group[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
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
    form.append('visibility', `${formData.get('visibility')}`);

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

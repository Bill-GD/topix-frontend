import { AxiosHandler } from '$lib/utils/axios-handler';
import { dataUrlToFile } from '$lib/utils/helpers';
import { CookieName } from '$lib/utils/types';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  'update-group': async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const newName = `${formData.get('group-name')}`;
    const description = `${formData.get('description')}`;

    if (!newName || newName.length <= 0) {
      return fail(400, { success: false, message: 'New name is not valid.' });
    }

    const form = new FormData();
    form.append('name', `${newName}`);
    if (description !== '') {
      form.append('description', `${description}`);
    }
    if (formData.get('group-banner') !== '') {
      form.append('banner', dataUrlToFile(`${formData.get('group-banner')}`));
    }

    const res = await AxiosHandler.patch(
      `/group/${params.id}`,
      form,
      cookies.get(CookieName.accessToken),
      {
        'Content-Type': 'multipart/form-data',
      },
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: 'Saved successfully!' };
  },
  'add-tag': async ({ request, params, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.post(
      `/group/${params.id}/tag`,
      {
        name: `${formData.get('name')}`,
        color: `${formData.get('tag-color')}`.substring(1),
      },
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'delete-tag': async ({ request, params, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.delete(
      `/group/${params.id}/tag/${formData.get('tag-id')}`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

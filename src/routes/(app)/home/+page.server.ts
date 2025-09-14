import { AxiosHandler } from '@/lib/utils/axios-handler';
import { CookieName } from '@/lib/utils/types';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const files: File[] = [];
    let urls: string[] = [];
    let type = 'image';
    const content = `${formData.get('content')}`;

    if (formData.has('video')) {
      type = 'video';
      files.push(formData.get('video') as File);
    } else if (formData.has('images')) {
      files.push(...(formData.getAll('images') as File[]));
    }

    if (files.length <= 0 && content.length <= 0) {
      return fail(400, {
        success: false,
        message: 'Content must not be empty if no image or video uploaded.',
      });
    }

    if (files.length > 0) {
      const form = new FormData();
      files.forEach((f) => form.append('files', f));

      const fileRes = await AxiosHandler.post(
        '/file/upload',
        form,
        event.cookies.get(CookieName.accessToken),
        { 'Content-Type': 'multipart/form-data' },
      );
      if (!fileRes.success) {
        return fail(fileRes.status, { success: false, message: fileRes.message });
      }
      urls = fileRes.data as string[];
    }

    const dto = {
      ownerId: formData.get('user-id'),
      type,
      content,
      mediaPaths: urls,
    };

    const res = await AxiosHandler.post('/post', dto, event.cookies.get(CookieName.accessToken));
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
  },
};

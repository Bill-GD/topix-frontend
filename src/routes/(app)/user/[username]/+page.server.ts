import { AxiosHandler, handleReaction } from '@/lib/utils/axios-handler';
import { fail, type Actions } from '@sveltejs/kit';
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

export const actions: Actions = {
  'post-upload': async (event) => {
    const formData = await event.request.formData();
    const files: File[] = [];
    let urls: string[] = [];
    let type = 'image';
    const content = `${formData.get('content')}`;

    if (formData.has('video')) {
      const vid = formData.get('video') as File;
      if (vid.size > 0) {
        type = 'video';
        files.push(vid);
      }
    } else if (formData.has('images')) {
      files.push(...(formData.getAll('images') as File[]).filter((f) => f.size > 0));
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
      type,
      content,
      mediaPaths: urls,
    };

    const res = await AxiosHandler.post('/post', dto, event.cookies.get(CookieName.accessToken));
    if (res.success) return { success: true, message: 'Saved successfully!' };
    return fail(res.status, { success: false, message: res.message });
  },
  react: handleReaction,
};

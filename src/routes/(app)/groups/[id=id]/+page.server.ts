import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Group, type Post, type Thread } from '$lib/utils/types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
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

  const threadsRes = await AxiosHandler.get(
    `/thread?groupId=${params.id}&size=5`,
    cookies.get(CookieName.accessToken),
  );
  if (!threadsRes.success) {
    error(threadsRes.status, { status: threadsRes.status, message: threadsRes.message });
  }

  return {
    group: groupRes.data as unknown as Group,
    posts: postsRes.data as unknown as Post[],
    threads: threadsRes.data as unknown as Thread[],
  };
};

export const actions: Actions = {
  'add-post': async (event) => {
    const formData = await event.request.formData();
    const files: File[] = [];
    let urls: string[] = [];
    let type = 'image';
    const content = `${formData.get('content')}`.replaceAll('\r\n\r\n', '\n');

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

    const res = await AxiosHandler.post(
      `/group/${event.params.id}/post`,
      dto,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  react: handleReaction,
  'join-group': async (event) => {
    const res = await AxiosHandler.post(
      `/group/${event.params.id}/join`,
      undefined,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'leave-group': async (event) => {
    const res = await AxiosHandler.delete(
      `/group/${event.params.id}/member`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'delete-group': async (event) => {
    const res = await AxiosHandler.delete(
      `/group/${event.params.id}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    redirect(303, '/groups');
  },
  'create-thread': async (event) => {
    const formData = await event.request.formData();
    const title = `${formData.get('thread-title')}`;

    if (title === null || title.length <= 0) {
      return fail(400, { success: false, message: 'Title can not be empty' });
    }

    const res = await AxiosHandler.post(
      `/group/${event.params.id}/thread`,
      { title },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { CookieName, type Post, type Tag, type Thread } from '$lib/utils/types';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const postsRes = await AxiosHandler.get(
    `/post?groupId=${params.id}&accepted=true`,
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

  const tagsRes = await AxiosHandler.get(
    `/group/${params.id}/tags`,
    cookies.get(CookieName.accessToken),
  );
  if (!tagsRes.success) {
    error(tagsRes.status, { status: tagsRes.status, message: tagsRes.message });
  }

  return {
    posts: postsRes.data as unknown as Post[],
    threads: threadsRes.data as unknown as Thread[],
    tags: tagsRes.data as unknown as Tag[],
  };
};

export const actions: Actions = {
  'add-post': async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const files: File[] = [];
    const content = `${formData.get('content')}`.replaceAll('\r\n\r\n', '\n');
    const tagId = Number(formData.get('tag-id'));
    let type = 'image';

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

    const form = new FormData();
    form.append('type', type);
    form.append('content', content);
    form.append('approved', `${formData.has('group-approved')}`);
    if (tagId > 0) form.append('tagId', `${tagId}`);
    if (files.length > 0) files.forEach((f) => form.append('files', f));

    const res = await AxiosHandler.post(
      `/group/${params.id}/post`,
      form,
      cookies.get(CookieName.accessToken),
      { 'Content-Type': 'multipart/form-data' },
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
    const tagId = Number(formData.get('tag-id'));

    if (title === null || title.length <= 0) {
      return fail(400, { success: false, message: 'Title can not be empty' });
    }

    const res = await AxiosHandler.post(
      `/group/${event.params.id}/thread`,
      { title, tagId: tagId > 0 ? tagId : undefined },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'delete-post': async (event) => {
    const formData = await event.request.formData();
    const postId = formData.get('post-id');

    const res = await AxiosHandler.delete(
      `/post/${postId}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

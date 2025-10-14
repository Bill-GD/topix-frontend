import { AxiosHandler, handleReaction } from '$lib/utils/axios-handler';
import { getPostUploadForm } from '$lib/utils/helpers';
import { CookieName, type CurrentUser, type Post, type Thread } from '$lib/utils/types';
import { type Actions, error, fail, isActionFailure, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const data: { thread: Thread; posts: Post[] } = {
    thread: {} as Thread,
    posts: [],
  };

  const threadRes = await AxiosHandler.get(
    `/thread/${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!threadRes.success) {
    error(threadRes.status, { message: threadRes.message, status: threadRes.status });
  }
  data.thread = threadRes.data as unknown as Thread;

  if (data.thread.groupId && data.thread.groupVisibility !== 'public' && !data.thread.joinedGroup) {
    redirect(303, `/groups/${data.thread.groupId}`);
  }

  const postRes = await AxiosHandler.get(
    `/post?threadId=${params.id}${data.thread.groupId ? `&groupId=${data.thread.groupId}` : ''}`,
    cookies.get(CookieName.accessToken),
  );
  if (!postRes.success) {
    error(postRes.status, { message: postRes.message, status: postRes.status });
  }
  data.posts = postRes.data as unknown as Post[];

  return data;
};

export const actions: Actions = {
  react: handleReaction,
  'delete-thread': async ({ request, params, cookies }) => {
    const formData = await request.formData();
    const res = await AxiosHandler.delete(
      `/thread/${params.id}`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    if (formData.has('group-id')) redirect(303, `/groups/${formData.get('group-id')}`);

    const currentUserStr = cookies.get(CookieName.currentUser);
    if (currentUserStr) {
      redirect(303, `/user/${(JSON.parse(currentUserStr) as CurrentUser).username}`);
    }
    redirect(303, '/home');
  },
  'update-thread': async (event) => {
    const formData = await event.request.formData();
    const newTitle = formData.get('new-title');

    if (!newTitle || newTitle === '') {
      return fail(400, { success: false, message: 'Thread title must not be empty.' });
    }

    const res = await AxiosHandler.patch(
      `/thread/${event.params.id}`,
      { title: newTitle, visibility: formData.get('visibility') ?? undefined },
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'add-post': async ({ request, params, cookies }) => {
    const form = await getPostUploadForm(request);
    if (isActionFailure(form)) return form;

    const res = await AxiosHandler.post(
      `/thread/${params.id}/post`,
      form,
      cookies.get(CookieName.accessToken),
      { 'Content-Type': 'multipart/form-data' },
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
  follow: async ({ params, cookies }) => {
    const res = await AxiosHandler.post(
      `/thread/${params.id}/follow`,
      undefined,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  unfollow: async ({ params, cookies }) => {
    const res = await AxiosHandler.delete(
      `/thread/${params.id}/follow`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

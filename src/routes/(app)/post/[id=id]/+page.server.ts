import { AxiosHandler, handlePostDeletion, handleReaction } from '$lib/utils/axios-handler';
import { getPostUploadForm } from '$lib/utils/helpers';
import { CookieName, type Post } from '$lib/utils/types';
import { type Actions, error, fail, isActionFailure, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies, params }) => {
  const self = (await parent()).self;
  const data: { post: Post; replies: Post[] } = {
    post: {} as Post,
    replies: [],
  };

  const postRes = await AxiosHandler.get(`/post/${params.id}`, cookies.get(CookieName.accessToken));
  if (!postRes.success) error(postRes.status, postRes.message);

  data.post = postRes.data as unknown as Post;

  if (data.post.groupId && data.post.groupVisibility !== 'public' && !data.post.joinedGroup) {
    redirect(303, `/groups/${data.post.groupId}`);
  }

  if (
    data.post.threadId &&
    data.post.threadVisibility !== 'public' &&
    self.id !== data.post.threadOwnerId
  ) {
    redirect(303, `/threads/${data.post.threadId}`);
  }

  const repliesRes = await AxiosHandler.get(
    `/post?parentId=${params.id}${data.post.groupId ? `&groupId=${data.post.groupId}` : ''}${data.post.threadId ? `&threadId=${data.post.threadId}` : ''}`,
    cookies.get(CookieName.accessToken),
  );
  if (!repliesRes.success) error(repliesRes.status, repliesRes.message);

  data.replies = repliesRes.data as unknown as Post[];

  return data;
};

export const actions: Actions = {
  react: handleReaction,
  'delete-post': handlePostDeletion,
  reply: async ({ request, cookies, params }) => {
    const form = await getPostUploadForm(request);
    if (isActionFailure(form)) return form;

    const res = await AxiosHandler.post(
      `/post/${params.id}/reply`,
      form,
      cookies.get(CookieName.accessToken),
      { 'Content-Type': 'multipart/form-data' },
    );
    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'update-post-visibility': async ({ request, cookies, params }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.patch(
      `/post/${params.id}`,
      { visibility: `${formData.get('visibility')}` },
      cookies.get(CookieName.accessToken),
    );
    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

import { AxiosHandler, handlePostDeletion, handleReaction } from '$lib/utils/axios-handler';
import { getFeedSearchParams, getPostUploadForm } from '$lib/utils/helpers';
import { CookieName, type Post, type Tag, type Thread } from '$lib/utils/types';
import {
  type Actions, error, fail, isActionFailure,
  redirect,
} from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url, parent, fetch }) => {
  const group = (await parent()).group;
  if (group.visibility !== 'public' && group.status !== true) {
    return {
      posts: [] as Post[],
      threads: [] as Thread[],
      tags: [] as Tag[],
    };
  }
  const tab = url.searchParams.get('tab') ?? 'posts';
  const tagsRes = await AxiosHandler.get(
    `/group/${params.id}/tags`,
    cookies.get(CookieName.accessToken),
  );
  if (!tagsRes.success) error(tagsRes.status, tagsRes.message);

  switch (tab) {
    case 'posts': {
      const searchString = url.searchParams.get('q');

      const res = await fetch(
        `/api/posts?${
          searchString
            ? getFeedSearchParams(
                searchString,
                new Map<string, string>([
                  ['groupId', params.id],
                  ['accepted', 'true'],
                ]),
              )
            : `groupId=${params.id}&accepted=true`
        }`,
      );

      return {
        posts: (await res.json()) as unknown as Post[],
        tags: tagsRes.data as unknown as Tag[],
        endOfList: res.headers.get('x-end-of-list') === 'true',
      };
    }
    case 'threads': {
      const res = await fetch(`/api/threads?groupId=${params.id}`);

      return {
        threads: (await res.json()) as unknown as Thread[],
        tags: tagsRes.data as unknown as Tag[],
        endOfList: res.headers.get('x-end-of-list') === 'true',
      };
    }
    default: {
      error(404, 'Unknown tab');
    }
  }
};

export const actions: Actions = {
  'add-post': async ({ request, params, cookies }) => {
    const form = await getPostUploadForm(request);
    if (isActionFailure(form)) return form;

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
  'delete-group': async ({ params, cookies }) => {
    const res = await AxiosHandler.delete(
      `/group/${params.id}`,
      cookies.get(CookieName.accessToken),
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
  'delete-post': handlePostDeletion,
};

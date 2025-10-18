import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName } from '$lib/utils/types';
import { type Actions, error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
  const tab = url.searchParams.get('tab') ?? 'all';
  if (!['all', 'pending'].includes(tab)) {
    error(404, 'Unknown tab');
  }

  const accepted = tab === 'all';
  const res = await AxiosHandler.get(
    `/group/${params.id}/members?accepted=${accepted}`,
    cookies.get(CookieName.accessToken),
  );
  if (!res.success) error(res.status, res.message);

  return {
    members: res.data as unknown as {
      id: number;
      username: string;
      displayName: string;
      profilePicture: string | null;
      dateRequested: string;
      dateJoined: string | null;
    }[],
  };
};

export const actions: Actions = {
  'change-owner': async ({ request, params, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.post(
      `/group/${params.id}/change-owner`,
      { newOwnerId: Number(formData.get('member-id')) },
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'accept-member': async ({ request, params, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.post(
      `/group/${params.id}/member/${formData.get('member-id')}`,
      undefined,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
  'remove-member': async ({ request, params, cookies }) => {
    const formData = await request.formData();

    const res = await AxiosHandler.delete(
      `/group/${params.id}/member/${formData.get('member-id')}`,
      cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

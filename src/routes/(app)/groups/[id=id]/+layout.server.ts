import { AxiosHandler } from '$lib/utils/axios-handler';
import { CookieName, type Group } from '$lib/utils/types';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, params }) => {
  const groupRes = await AxiosHandler.get(
    `/group/${params.id}`,
    cookies.get(CookieName.accessToken),
  );
  if (!groupRes.success) {
    error(groupRes.status, { status: groupRes.status, message: groupRes.message });
  }

  return {
    group: groupRes.data as unknown as Group,
  };
};

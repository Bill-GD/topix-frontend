import { AxiosHandler } from '$lib/utils/axios-handler';
import type { Notification } from '$lib/utils/types';
import { CookieName } from '$lib/utils/types';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/notifications');

  return {
    notifications: (await res.json()) as Notification[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
};

export const actions: Actions = {
  'delete-notification': async (event) => {
    const formData = await event.request.formData();

    const res = await AxiosHandler.delete(
      `/notification/${formData.get('noti-id')}`,
      event.cookies.get(CookieName.accessToken),
    );

    if (!res.success) return fail(res.status, { success: false, message: res.message });
    return { success: true, message: res.message };
  },
};

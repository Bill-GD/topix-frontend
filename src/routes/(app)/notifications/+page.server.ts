import type { Notification } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch('/api/notifications');

  return {
    notifications: (await res.json()) as Notification[],
    endOfList: res.headers.get('x-end-of-list') === 'true',
  };
};

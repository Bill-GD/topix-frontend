import { CookieName } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    token: cookies.get(CookieName.accessToken),
  };
};

import { CookieName } from '@/lib/utils/types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete(CookieName.accessToken, { path: '/' });
  cookies.delete(CookieName.refreshToken, { path: '/' });
  redirect(303, '/');
};

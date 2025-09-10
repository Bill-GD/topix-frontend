import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteTokens } from '@/lib/utils/helpers';

export const load: PageServerLoad = async ({ cookies }) => {
  deleteTokens(cookies);
  redirect(303, '/login');
};

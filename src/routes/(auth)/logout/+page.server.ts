import { deleteTokens } from '$lib/utils/helpers';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  deleteTokens(cookies);
  redirect(303, '/login');
};

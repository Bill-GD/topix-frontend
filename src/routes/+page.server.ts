import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.hasAT) redirect(303, '/home');
  else redirect(303, '/login');
};

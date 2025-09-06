import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // TODO add login state checks
  return redirect(303, '/login');
};

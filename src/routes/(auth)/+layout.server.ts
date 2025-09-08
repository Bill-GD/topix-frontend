import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { checkLogin } from '@/lib/utils/helpers';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const res = await checkLogin(cookies);
  if (res) redirect(303, '/home');
};

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
  const tab = url.searchParams.get('tab') ?? 'new';
};

import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
  return ['account', 'profile'].includes(param);
};

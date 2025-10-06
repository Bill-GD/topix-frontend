import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
  return ['account', 'profile', 'display', 'danger'].includes(param);
};

import type { Handle } from '@sveltejs/kit';
import { requestLogger } from './lib/middlewares';

export const handle: Handle = async ({ event, resolve }) => {
  const startTime = performance.now();

  const res = await resolve(event);
  requestLogger(event, res, startTime);

  return res;
};

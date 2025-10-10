import { type Handle, redirect } from '@sveltejs/kit';
import { requestLogger } from './lib/middlewares';
import { CookieName } from './lib/utils/types';

export const handle: Handle = async ({ event, resolve }) => {
  const startTime = performance.now();

  event.locals.hasAT = event.cookies.get(CookieName.accessToken) !== undefined;
  event.locals.hasRT = event.cookies.get(CookieName.refreshToken) !== undefined;

  try {
    const eventRes = await resolve(event);
    requestLogger(event, eventRes, startTime);
    return eventRes;
  } catch (err) {
    console.log('Error:', err);
    redirect(303, '/');
  }
};

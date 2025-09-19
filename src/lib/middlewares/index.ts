import type { RequestEvent } from '@sveltejs/kit';
import { getLogTimestamp } from '../utils/helpers';

// let time = 0;

export function requestLogger(event: RequestEvent, res: Response, startTime: number): void {
  let diff = performance.now() - startTime;
  if (diff < 1) diff = +diff.toPrecision(3);
  else diff = Math.trunc(diff);

  console.log(
    `[${getLogTimestamp(new Date(Date.now()))}]`,
    event.request.method,
    `${event.url.pathname}${event.url.search}`,
    res.status,
    '-',
    `${diff} ms`,
  );
}

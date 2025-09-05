import type { RequestEvent } from '@sveltejs/kit';
import { getLogTimestamp } from '../utils/helpers';

// let time = 0;

export function requestLogger(event: RequestEvent, res: Response, startTime: number): void {
  let diff = performance.now() - startTime;
  if (diff < 1) diff = +diff.toPrecision(3);
  else diff = Math.trunc(diff);

  // const newTime = Date.now();
  // let sinceLast = 0;
  // if (time !== 0) sinceLast = newTime - time;
  // time = newTime;

  console.log(
    `[${getLogTimestamp(new Date(Date.now()))}]`,
    event.request.method,
    `${event.url.pathname}${event.url.search}`,
    res.status,
    '-',
    `${diff} ms`,
    // sinceLast > 0 ? `(${sinceLast} ms)` : '',
  );
}

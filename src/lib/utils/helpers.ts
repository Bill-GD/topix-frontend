import { API_PORT, API_SERVER } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';
import { AxiosHandler } from './axios-handler';
import { CookieName } from './types';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let num = Date.now();

export function getContrastColor(hex: string): 'black' | 'white' {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

export function generateId(): string {
  return (++num).toString(36);
}

export function getLogTimestamp(date: Date): string {
  const h = padIntLeft(date.getHours(), 2, '0');
  const m = padIntLeft(date.getMinutes(), 2, '0');
  const s = padIntLeft(date.getSeconds(), 2, '0');
  const ms = padIntLeft(date.getMilliseconds(), 2, '0');

  return `${h}:${m}:${s}.${ms}`;
}

export function padIntLeft(num: number, length: number, char: string): string {
  return `${num}`.padStart(length, char);
}

export function getApiUrl(): string {
  return `${API_SERVER}:${API_PORT}`;
}

export function capitalize(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export async function checkLogin(cookies: Cookies): Promise<boolean> {
  try {
    const res = await AxiosHandler.get('/auth/check', cookies.get(CookieName.accessToken));
    return res.success;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return false;
  }
}

export function deleteTokens(cookies: Cookies): void {
  cookies.delete(CookieName.accessToken, { path: '/' });
  cookies.delete(CookieName.refreshToken, { path: '/' });
}

export function dataUrlToFile(dataUrl: string): File {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const ext = mime.split('/')[1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], `${Date.now()}.${ext}`, { type: mime });
}

export function getReadableSize(byte: number): string {
  let size = byte;
  const postfix = ['B', 'KB', 'MB'];
  let postfixIndex = 0;
  while (size > 1024) {
    size /= 1024;
    postfixIndex++;
  }
  return `${size} ${postfix[postfixIndex]}`;
}

export function getTimeAgo(ms: number): string {
  const diffInSec = Math.trunc((Date.now() - ms + 25200000) / 1000);

  // 2 weeks
  if (diffInSec > 1209600) {
    const date = new Date(ms);
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }

  let interval = diffInSec / 604800;
  if (interval > 1) return `${Math.trunc(interval)}w`;

  interval = diffInSec / 86400;
  if (interval > 1) return `${Math.trunc(interval)}d`;

  interval = diffInSec / 3600;
  if (interval > 1) return `${Math.trunc(interval)}h`;

  interval = diffInSec / 60;
  if (interval > 1) return `${Math.trunc(interval)}m`;

  return `${diffInSec}`;
}

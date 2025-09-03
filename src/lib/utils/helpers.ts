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

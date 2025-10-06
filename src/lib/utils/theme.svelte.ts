import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';

export class Theme {
  #mode = $state<'dark' | 'light'>('dark');

  constructor() {
    if (browser) {
      const item = localStorage.getItem('theme');
      this.#mode = (item ?? 'light') as 'dark' | 'light';
    }
  }

  get isDark() {
    return this.#mode === 'dark';
  }

  toggle = (mode: 'dark' | 'light') => {
    this.#mode = mode;
    if (browser) {
      localStorage.setItem('theme', this.#mode);
    }
  };
}

const ThemeKey = Symbol('Theme');

export function initTheme() {
  return setContext(ThemeKey, new Theme());
}

export function getTheme() {
  return getContext<Theme>(ThemeKey);
}

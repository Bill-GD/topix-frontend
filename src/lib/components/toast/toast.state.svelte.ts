import type { ToastMessage } from '$lib/utils/types';
import { getContext, setContext } from 'svelte';

export class Toaster {
  #toastId = 0;
  toasts = $state<ToastMessage[]>([]);

  addToast(message: string, type: 'success' | 'info' | 'error') {
    this.toasts.push({ id: this.#toastId++, message, type });
    setTimeout(() => this.toasts.shift(), 4100);
  }
}

const ToasterKey = Symbol('Toaster');

export function initToaster() {
  return setContext(ToasterKey, new Toaster());
}

export function getToaster() {
  return getContext<ReturnType<typeof initToaster>>(ToasterKey);
}

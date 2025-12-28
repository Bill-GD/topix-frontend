import type { Notification, ToastMessage } from '$lib/utils/types';
import { getContext, setContext } from 'svelte';

export class Toaster {
  #toastId = 0;
  toasts = $state<ToastMessage[]>([]);

  addToast(content: string | Notification, type: 'success' | 'info' | 'error') {
    this.toasts.push({
      id: this.#toastId++,
      message: typeof content === 'string' ? content : undefined,
      notiPayload: typeof content != 'string' ? content : undefined,
      type,
    });
    setTimeout(() => this.toasts.shift(), 4400);
  }
}

const ToasterKey = Symbol('Toaster');

export function initToaster() {
  return setContext(ToasterKey, new Toaster());
}

export function getToaster() {
  return getContext<ReturnType<typeof initToaster>>(ToasterKey);
}

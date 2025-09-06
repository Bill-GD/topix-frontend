// component-related types

import {
  faBars,
  faEye,
  faEyeSlash,
  faFaceAngry,
  faFaceFrownOpen,
  faFaceLaugh,
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faMessage,
  faReply,
  faThumbsUp,
  faTriangleExclamation,
  faUserGroup,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { Snippet } from 'svelte';
import type {
  ClassValue,
  HTMLAttributeAnchorTarget,
  HTMLInputTypeAttribute,
} from 'svelte/elements';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const IconSize = {
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
  eye: { color: 'text-white', icon: faEye },
  eyeSlash: { color: 'text-white', icon: faEyeSlash },
  error: { color: 'text-red-400', icon: faTriangleExclamation },
  home: { color: 'text-white', icon: faHouse },
  search: { color: 'text-white', icon: faMagnifyingGlass },
  group: { color: 'text-white', icon: faUserGroup },
  message: { color: 'text-white', icon: faMessage },
  reply: { color: 'text-white', icon: faReply },
  menu: { color: 'text-white', icon: faBars },
  close: { color: 'text-white', icon: faXmark },
  like: { color: 'text-sky-600', icon: faThumbsUp },
  heart: { color: 'text-red-500', icon: faHeart },
  laugh: { color: 'text-yellow-500', icon: faFaceLaugh },
  sad: { color: 'text-yellow-500', icon: faFaceFrownOpen },
  angry: { color: 'text-red-500', icon: faFaceAngry },
} as const;

export interface ButtonProps {
  type: ButtonType;
  outline?: boolean;
  href?: string | undefined;
  formaction?: string | undefined;
  onclick?: VoidFunction | undefined;
  disabled?: boolean;
  children?: Snippet;
  class?: ClassValue | undefined | null;
}

export interface IconProps {
  type: keyof typeof Icons;
  hover?: boolean;
  size?: keyof typeof IconSize;
  color?: string;
  class?: ClassValue | undefined | null;
}

export interface IconButtonProps {
  icon: keyof typeof Icons;
  size?: keyof typeof IconSize;
  onclick?: VoidFunction | undefined;
  disabled?: boolean | undefined | null;
  type?: 'submit' | 'reset' | 'button' | undefined | null;
  class?: ClassValue | undefined | null;
}

export interface NavItemProps {
  title: string;
  href: string;
  children: Snippet;
}

export interface FlairProps {
  title: string;
  color: string;
}

export interface NavAccountProps {
  displayName: string;
  username: string;
  imageURL: string;
  class?: ClassValue | undefined | null;
}

export interface InputProps {
  clearable?: boolean;
  peekable?: boolean;
  id: string | null;
  value?: string;
  type?: HTMLInputTypeAttribute | undefined | null;
  class?: ClassValue | undefined | null;
  required?: boolean | undefined | null;
  name?: string | undefined | null;
  placeholder?: string | undefined | null;
}

export interface FloatingLabelInputProps {
  clearable?: boolean;
  peekable?: boolean;
  children: Snippet;
  value?: string;
  type?: HTMLInputTypeAttribute | undefined | null;
  class?: ClassValue | undefined | null;
  required?: boolean | undefined | null;
  name?: string | undefined | null;
}

export interface LinkProps {
  href?: string | undefined | null;
  class?: ClassValue | undefined | null;
  target?: HTMLAttributeAnchorTarget | undefined | null;
  children: Snippet;
}

export interface ErrorProps {
  children: Snippet;
  class?: ClassValue | undefined | null;
}

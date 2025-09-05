// component-related types

import {
  faBars,
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
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLInputAttributes,
} from 'svelte/elements';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const IconSize = {
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
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

export interface IconButtonProps extends HTMLButtonAttributes {
  icon: keyof typeof Icons;
  size?: keyof typeof IconSize;
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

export interface NavAccountProps extends HTMLAttributes<HTMLDivElement> {
  displayName: string;
  username: string;
  imageURL: string;
}

export interface InputProps extends HTMLInputAttributes {
  clearable?: boolean;
}
export interface FloatingLabelInputProps extends HTMLInputAttributes {
  clearable?: boolean;
  children: Snippet;
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

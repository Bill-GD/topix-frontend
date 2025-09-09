// component-related types

import {
  faBars,
  faChevronLeft,
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
import type { User } from '../utils/types';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const IconSize = {
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
  back: faChevronLeft,
  eye: faEye,
  eyeSlash: faEyeSlash,
  error: faTriangleExclamation,
  home: faHouse,
  search: faMagnifyingGlass,
  group: faUserGroup,
  message: faMessage,
  reply: faReply,
  menu: faBars,
  close: faXmark,
  like: faThumbsUp,
  heart: faHeart,
  laugh: faFaceLaugh,
  sad: faFaceFrownOpen,
  angry: faFaceAngry,
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

export interface ErrorProps {
  children: Snippet;
  class?: ClassValue | undefined | null;
}

export interface FlairProps {
  title: string;
  color: string;
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

export interface HomeLayoutProps {
  children?: Snippet;
  right?: Snippet;
  self: Partial<User>;
}

export interface IconProps {
  type: keyof typeof Icons;
  hover?: boolean;
  size?: keyof typeof IconSize;
  color?: string;
  class?: ClassValue | undefined | null;
}

export interface IconButtonProps {
  children: Snippet;
  onclick?: VoidFunction | undefined;
  disabled?: boolean | undefined | null;
  type?: 'submit' | 'reset' | 'button' | undefined | null;
  class?: ClassValue | undefined | null;
}

export interface InputProps {
  clearable?: boolean;
  peekable?: boolean;
  textarea?: boolean;
  id?: string | null;
  value?: string;
  type?: HTMLInputTypeAttribute | undefined | null;
  class?: ClassValue | undefined | null;
  required?: boolean | undefined | null;
  name?: string | undefined | null;
  placeholder?: string | undefined | null;
}

export interface LinkProps {
  href?: string | undefined | null;
  class?: ClassValue | undefined | null;
  target?: HTMLAttributeAnchorTarget | undefined | null;
  children: Snippet;
}

export interface NavItemProps {
  title: string;
  href: string;
  children: Snippet;
}

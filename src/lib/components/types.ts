// component-related types

import {
  faChevronLeft,
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faFaceAngry,
  faFaceFrownOpen,
  faFaceLaugh,
  faHeart,
  faHouse,
  faImage,
  faMagnifyingGlass,
  faMessage,
  faReply,
  faThumbsUp,
  faTriangleExclamation,
  faUserGroup,
  faVideo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { Snippet } from 'svelte';
import type {
  ClassValue,
  HTMLAttributeAnchorTarget,
  HTMLInputTypeAttribute,
} from 'svelte/elements';
import type { Post, UnaryVoidFunction, User } from '../utils/types';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const IconSize = {
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
  video: faVideo,
  image: faImage,
  back: faChevronLeft,
  eye: faEye,
  eyeSlash: faEyeSlash,
  error: faTriangleExclamation,
  home: faHouse,
  search: faMagnifyingGlass,
  group: faUserGroup,
  message: faMessage,
  reply: faReply,
  menu: faEllipsisVertical,
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
  href?: string;
  formaction?: string;
  onclick?: VoidFunction;
  disabled?: boolean;
  children?: Snippet;
  class?: ClassValue | null;
}

export interface DropdownMenuProps {
  children: Snippet;
  trigger: Snippet;
  class?: ClassValue | null;
  align: 'start' | 'end';
  position: 'top' | 'bottom';
  origin: 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl';
}

export interface DropdownItemProps {
  children: Snippet;
  href?: string;
  rel?: string;
  class?: ClassValue | null;
}

export interface ErrorProps {
  children: Snippet;
  class?: ClassValue | null;
}

export interface FileDropzoneProps {
  contentInputName: string;
  filenameInputName: string;
  contentValue: string;
  filenameValue: string;
  class?: ClassValue | null;
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
  type?: HTMLInputTypeAttribute | null;
  class?: ClassValue | null;
  required?: boolean | null;
  name?: string | null;
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
  class?: ClassValue | null;
}

export interface IconButtonProps {
  children: Snippet;
  onclick?: VoidFunction | UnaryVoidFunction<Event>;
  disabled?: boolean | null;
  type?: 'submit' | 'reset' | 'button' | null;
  class?: ClassValue | null;
}

export interface InputProps {
  clearable?: boolean;
  peekable?: boolean;
  textarea?: boolean;
  id?: string | null;
  value?: string;
  type?: HTMLInputTypeAttribute | null;
  class?: ClassValue | null;
  required?: boolean | null;
  name?: string | null;
  placeholder?: string | null;
}

export interface LinkProps {
  href?: string | null;
  class?: ClassValue | null;
  target?: HTMLAttributeAnchorTarget | null;
  children: Snippet;
}

export interface NavItemProps {
  title: string;
  href: string;
  children: Snippet;
  class?: ClassValue | null;
}

export interface PostUploadProps {
  userId: number;
  errorText?: string;
  userPicture: string | null;
  formaction?: string;
}

export interface PostProps {
  username: string;
  owner: Partial<User>;
  content?: Snippet;
  post: Partial<Post>;
  mediaPaths?: string[];
}

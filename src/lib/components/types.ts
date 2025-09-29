// component-related types

import { faThumbsUp as faClassicThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faCircleInfo,
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
  faPlus,
  faReply,
  faThumbsUp,
  faTrashCan,
  faTriangleExclamation,
  faUser,
  faUserGroup,
  faUserMinus,
  faUserPlus,
  faVideo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { Snippet } from 'svelte';
import type {
  ClassValue,
  HTMLAttributeAnchorTarget,
  HTMLInputTypeAttribute,
} from 'svelte/elements';
import type { CurrentUser, Post, Tag, ToastMessage, UnaryVoidFunction } from '../utils/types';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const IconSize = {
  xs: ['h-3', 'w-3'],
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
  delete: faTrashCan,
  user: faUser,
  info: faCircleInfo,
  success: faCircleCheck,
  check: faCheck,
  unfollow: faUserMinus,
  follow: faUserPlus,
  add: faPlus,
  video: faVideo,
  image: faImage,
  back: faChevronLeft,
  next: faChevronRight,
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
  noReaction: faClassicThumbsUp,
  like: faThumbsUp,
  heart: faHeart,
  laugh: faFaceLaugh,
  sad: faFaceFrownOpen,
  angry: faFaceAngry,
} as const;

export interface ButtonProps {
  id?: string;
  type: ButtonType;
  outline?: boolean;
  href?: string;
  formaction?: string;
  onclick?: VoidFunction | UnaryVoidFunction<Event>;
  disabled?: boolean;
  children?: Snippet;
  class?: ClassValue;
}

export interface DropdownMenuProps {
  children: Snippet;
  trigger: Snippet;
  class?: ClassValue;
  horizontal?: boolean;
  align: 'left' | 'right';
  position: 'top' | 'bottom';
}

export interface DropdownItemProps {
  children: Snippet;
  href?: string;
  rel?: string;
  class?: ClassValue;
  noHover?: boolean;
  onclick?: VoidFunction;
}

export interface ToastProps {
  class?: ClassValue;
  toast: ToastMessage;
}

export interface FileDropzoneProps {
  contentInputName: string;
  filenameInputName: string;
  contentValue: string;
  filenameValue: string;
  class?: ClassValue;
}

export interface FlairProps {
  tag: Tag;
}

export interface FloatingLabelInputProps {
  clearable?: boolean;
  peekable?: boolean;
  children: Snippet;
  value?: string;
  type?: HTMLInputTypeAttribute | null;
  class?: ClassValue;
  labelClass?: ClassValue;
  required?: boolean | null;
  name?: string | null;
}

export interface IconProps {
  type: keyof typeof Icons;
  hover?: boolean;
  size?: keyof typeof IconSize;
  color?: string;
  class?: ClassValue;
}

export interface IconButtonProps {
  children: Snippet;
  onclick?: VoidFunction | UnaryVoidFunction<Event>;
  disabled?: boolean | null;
  type?: 'submit' | 'reset' | 'button' | null;
  variant?: ButtonType;
  outline?: boolean;
  class?: ClassValue;
  round?: boolean;
}

export interface InputProps {
  clearable?: boolean;
  peekable?: boolean;
  textarea?: boolean;
  id?: string | null;
  value?: string;
  type?: HTMLInputTypeAttribute | null;
  class?: ClassValue;
  required?: boolean | null;
  name?: string | null;
  placeholder?: string | null;
}

export interface LinkProps {
  href?: string | null;
  class?: ClassValue;
  target?: HTMLAttributeAnchorTarget | null;
  children: Snippet;
}

export interface ModalProps {
  class?: ClassValue;
  id?: string;
  children: Snippet;
  icon?: Snippet;
  show: boolean;
  center?: boolean;
}

export interface NavItemProps {
  title: string;
  href: string;
  children: Snippet;
  class?: ClassValue;
}

export interface PostProps {
  class?: ClassValue;
  self: CurrentUser;
  post: Post;
  detail?: boolean;
  compact?: boolean;
  parent?: boolean;
  hideReplyMark?: boolean;
}

export interface PostUploadProps {
  userPicture: string | null;
  formaction?: string;
  placeholder?: string;
  postCallback?: VoidFunction;
}

export interface HomeLayoutProps {
  children?: Snippet;
  right?: Snippet;
  self: CurrentUser;
}

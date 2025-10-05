// component-related types

import type { Snippet } from 'svelte';
import type {
  ClassValue,
  HTMLAttributeAnchorTarget,
  HTMLInputTypeAttribute,
} from 'svelte/elements';
import { faThumbsUp as faRegularThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faFaceAngry } from '@fortawesome/free-solid-svg-icons/faFaceAngry';
import { faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons/faFaceFrownOpen';
import { faFaceLaugh } from '@fortawesome/free-solid-svg-icons/faFaceLaugh';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faMessage } from '@fortawesome/free-solid-svg-icons/faMessage';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons/faUserMinus';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import type { CurrentUser, Post, Tag, ToastMessage, UnaryVoidFunction } from '../utils/types';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const IconSize = {
  xs: ['h-3', 'w-3'],
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
  edit: faPen,
  delete: faTrashCan,
  user: faUser,
  bar: faBars,
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
  noReaction: faRegularThumbsUp,
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
  contentValue: string;
  class?: ClassValue;
}

export interface FlairProps {
  tag: Tag;
  class?: ClassValue;
  compact?: boolean;
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
  buttonType?: 'submit' | 'reset' | 'button' | null;
  type?: ButtonType;
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
  backdropCallback: VoidFunction;
}

export interface NavItemProps {
  title: string;
  href: string;
  children: Snippet;
  class?: ClassValue;
}

export interface PendingPostProps {
  class?: ClassValue;
  post: Post;
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
  tags?: Tag[];
  groupApproved?: boolean;
  threadId?: number;
  groupId?: number;
  postCallback?: VoidFunction;
}

export interface HomeLayoutProps {
  children?: Snippet;
  right?: Snippet;
  self: CurrentUser;
}

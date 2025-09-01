import {
  faFaceAngry,
  faFaceFrownOpen,
  faFaceLaugh,
  faHeart,
  faHouse,
  faMagnifyingGlass,
  faMessage,
  faReply,
  faThumbsUp,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import type { Snippet } from 'svelte';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export interface ButtonProps {
  type: ButtonType;
  outline?: boolean;
  href?: string | undefined;
  onclick?: VoidFunction | undefined;
  disabled?: boolean;
  children?: Snippet;
}

export const IconSize = {
  sm: ['h-5', 'w-5'],
  md: ['h-6', 'w-6'],
  lg: ['h-8', 'w-8'],
};

export const Icons = {
  home: { color: 'text-white', icon: faHouse },
  search: { color: 'text-white', icon: faMagnifyingGlass },
  group: { color: 'text-white', icon: faUserGroup },
  message: { color: 'text-white', icon: faMessage },
  reply: { color: 'text-white', icon: faReply },
  like: { color: 'text-sky-600', icon: faThumbsUp },
  heart: { color: 'text-red-500', icon: faHeart },
  laugh: { color: 'text-yellow-500', icon: faFaceLaugh },
  sad: { color: 'text-yellow-500', icon: faFaceFrownOpen },
  angry: { color: 'text-red-500', icon: faFaceAngry },
} as const;

export interface IconProps {
  type: keyof typeof Icons;
  hover?: boolean;
  size?: keyof typeof IconSize;
}

export interface NavItemProps {
  title: string;
  href: string;
  onclick?: VoidFunction | undefined;
}

export interface FlairProps {
  title: string;
  color: string;
}

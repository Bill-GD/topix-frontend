import type { Icons } from './component-types';

export interface NavItem {
  title: string;
  href: string;
  icon: keyof typeof Icons;
}

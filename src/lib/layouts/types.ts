// layout types

import type { Snippet } from 'svelte';
import type { CurrentUser } from '../utils/types';

export interface HomeLayoutProps {
  children?: Snippet;
  right?: Snippet;
  self: CurrentUser;
}

// layout types

import type { Snippet } from 'svelte';
import type { User } from '../utils/types';

export interface HomeLayoutProps {
  children?: Snippet;
  right?: Snippet;
  self: Partial<User>;
}

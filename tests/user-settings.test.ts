import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(app)/settings/[section=settings]/+page.svelte';
import type { User } from '@/lib/utils/types';

describe('home layout', () => {
  const user: Partial<User> = {
    username: 'test',
    displayName: 'Test',
    description: 'Description',
  };

  it('should render form button', async () => {
    render(Page, {
      data: {
        self: user as User,
        pathname: '/settings/account',
      },
    });
    expect.soft(page.getByText('Save', { exact: true })).toBeVisible();
  });

  it('should render account form', async () => {
    render(Page, {
      data: {
        self: user as User,
        pathname: '/settings/account',
      },
    });
    expect.soft(page.getByLabelText('Username')).toHaveDisplayValue('test');
  });

  it('should render profile form', async () => {
    render(Page, {
      data: {
        self: user as User,
        pathname: '/settings/profile',
      },
    });
    expect.soft(page.getByLabelText('Display name')).toHaveDisplayValue('Test');
    expect.soft(page.getByLabelText('Description')).toHaveDisplayValue('Description');
    expect.soft(page.getByAltText('user-profile')).toBeInTheDocument();
  });
});

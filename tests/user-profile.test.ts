import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(app)/user/[username]/+page.svelte';
import type { User } from '@/lib/utils/types';

describe('home layout', () => {
  const user: Partial<User> = {
    username: 'test',
    displayName: 'Test',
    description: 'Description',
    followerCount: 10,
    followingCount: 10,
  };

  beforeEach(() => {
    render(Page, {
      data: {
        self: user as User,
        user: { ...user, username: 'test-user', displayName: 'Test User' } as User,
      },
    });
  });

  it('should render action buttons', async () => {
    page
      .getByRole('button')
      .all()
      .forEach((item) => expect.soft(item).toBeVisible());
  });

  it('should render account picture', async () => {
    expect.soft(page.getByAltText('user-profile')).toBeInTheDocument();
  });

  it('should render account details', async () => {
    expect.soft(page.getByText('Test User', { exact: true })).toBeVisible();
    expect.soft(page.getByText('@test-user', { exact: true })).toBeVisible();
    expect.soft(page.getByText('Follower: 10', { exact: true })).toBeVisible();
    expect.soft(page.getByText('Following: 10', { exact: true })).toBeVisible();
  });
});

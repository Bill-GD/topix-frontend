import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Layout from '@/lib/layouts/HomeLayout.svelte';

describe('home layout', () => {
  beforeEach(() => {
    render(Layout, {
      self: { username: 'test', displayName: 'test' },
      children: () => {},
      right: () => {},
    });
  });

  it('should render all nav items', async () => {
    page
      .getByRole('link')
      .all()
      .forEach((item) => expect.soft(item).toBeInTheDocument());
  });

  it('should render account picture', async () => {
    expect.soft(page.getByAltText('profile')).toBeInTheDocument();
  });

  // requires excessive css importing
  // it('should show nav title only on lg', async () => {
  //   render(Layout);
  //   page.getByText('Home').query();

  //   await page.viewport(1600, 900);
  //   expect.soft(page.getByText('Home')).toBeVisible();

  //   await page.viewport(700, 900);
  //   expect.soft(page.getByText('Home')).not.toBeVisible();
  // });
});

import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Layout from '@/routes/(app)/+layout.svelte';

describe('home layout', () => {
  it('should render all nav items', async () => {
    render(Layout);
    page
      .getByRole('link')
      .all()
      .forEach((item) => expect.soft(item).toBeInTheDocument());
  });

  it('should render account picture', async () => {
    render(Layout);
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

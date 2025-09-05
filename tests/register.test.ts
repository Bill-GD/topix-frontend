import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(auth)/register/+page.svelte';

describe('(auth)/register/+page.svelte', () => {
  it('should render the form title', () => {
    render(Page);
    expect.soft(page.getByText(/sign up for topix/i)).toBeVisible();
  });

  it('should render the form and its content', () => {
    render(Page);
    expect.soft(page.getByRole('form', { name: 'signup' })).toBeVisible();

    expect.soft(page.getByRole('button')).toBeVisible();
    ['Email', 'Username', 'Password', 'Confirm password'].forEach((l) => {
      expect.soft(page.getByLabelText(l, { exact: true })).toBeVisible();
    });
    page
      .getByRole('textbox')
      .all()
      .forEach((b) => expect.soft(b).toBeVisible());
    expect.soft(page.getByRole('link')).toBeVisible();
  });

  it('all inputs should be required', async () => {
    render(Page);

    page
      .getByRole('textbox')
      .all()
      .forEach((el) => expect.soft(el).toBeRequired());
  });

  // doesnt actually run server-side code
  // it('should check for email validity', async () => {
  //   render(Page);

  //   const inputs = ['Email', 'Username', 'Password', 'Confirm password'].map((el) =>
  //     page.getByPlaceholder(el),
  //   );
  //   const button = page.getByRole('button');
  //   const fills = ['test@gmail', 'user123', 'password', 'password'];

  //   inputs.forEach(async (input, index) => {
  //     await input.fill(fills[index]);
  //   });
  //   await button.click();
  //   expect.soft(page.getByRole('img')).toBeVisible();
  // });
});

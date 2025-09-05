import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(auth)/verify/[id=userId]/+page.svelte';

describe('(auth)/verify/[id=userId]/+page.svelte', () => {
  it('should render the form title', () => {
    render(Page);
    expect.soft(page.getByText(/verify your email/i)).toBeVisible();
  });

  it('should render the form and its content', () => {
    render(Page);
    expect.soft(page.getByRole('form', { name: 'verify' })).toBeVisible();
    page
      .getByRole('button')
      .all()
      .forEach((b) => expect.soft(b).toBeVisible());
    expect.soft(page.getByLabelText(/code/i)).toBeVisible();
    expect.soft(page.getByRole('textbox')).toBeVisible();
  });

  it('input should be required', async () => {
    render(Page);
    expect.soft(page.getByRole('textbox')).toBeRequired();
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

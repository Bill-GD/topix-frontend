import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(auth)/register/+page.svelte';

describe('register page', () => {
  let hostBody: HTMLElement;

  beforeEach(() => {
    render(Page);
    hostBody = document.body;
  });

  it('should render the form title', () => {
    expect.soft(page.getByText(/sign up for topix/i)).toBeVisible();
  });

  it('should render the form and its content', () => {
    expect.soft(hostBody.querySelector('form[method=post]')).toBeVisible();

    hostBody.querySelectorAll('button').forEach((b) => expect.soft(b).toBeVisible());

    ['Email', 'Username', 'Password', 'Confirm password'].forEach((l) => {
      expect.soft(page.getByLabelText(l, { exact: true })).toBeVisible();
    });

    hostBody.querySelectorAll('input').forEach((b) => expect.soft(b).toBeVisible());
    expect.soft(page.getByRole('link')).toBeVisible();
  });

  it('all inputs should be required', async () => {
    hostBody.querySelectorAll('input').forEach((el) => expect.soft(el).toBeRequired());
  });

  // doesnt actually run server-side code
  // it('should check for email validity', async () => {

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

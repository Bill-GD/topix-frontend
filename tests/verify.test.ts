import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(auth)/verify/[id=userId]/+page.svelte';

describe('(auth)/verify/[id=userId]/+page.svelte', () => {
  let hostBody: HTMLElement;

  beforeEach(() => {
    render(Page);
    hostBody = document.body;
  });

  it('should render the form title', () => {
    expect.soft(page.getByText(/verify your email/i)).toBeVisible();
  });

  it('should render the form and its content', () => {
    expect.soft(hostBody.querySelector('form')).toBeVisible();
    hostBody.querySelectorAll('button').forEach((b) => expect.soft(b).toBeVisible());
    expect.soft(page.getByLabelText(/code/i)).toBeVisible();
    expect.soft(hostBody.querySelector('input')).toBeVisible();
  });

  it('input should not be required', async () => {
    expect.soft(hostBody.querySelector('input')).not.toBeRequired();
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

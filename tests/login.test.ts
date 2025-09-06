import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(auth)/login/+page.svelte';

describe('login page', () => {
  let hostBody: HTMLElement;

  beforeEach(() => {
    render(Page);
    hostBody = document.body;
  });

  it('should render the form title', () => {
    expect.soft(page.getByText(/sign in/i)).toBeVisible();
  });

  it('should render the form and its content', () => {
    expect.soft(hostBody.querySelector('form')).toBeVisible();

    hostBody.querySelectorAll('button').forEach((b) => expect.soft(b).toBeVisible());

    ['Username', 'Password'].forEach((l) => {
      expect.soft(page.getByLabelText(l, { exact: true })).toBeVisible();
      expect.soft(hostBody.querySelector('input')).toBeVisible();
    });
  });

  it('all inputs should be required', async () => {
    hostBody.querySelectorAll('input').forEach((b) => expect.soft(b).toBeRequired());
  });
});

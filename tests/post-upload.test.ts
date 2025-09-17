import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Component from '$lib/components/PostUpload.svelte';

describe('post upload component', () => {
  it('should render all default elements', async () => {
    render(Component, {
      userPicture: '',
    });
    expect.soft(page.getByRole('button')).toBeVisible();
    expect.soft(page.getByAltText('profile')).toBeVisible();
    const editor = document.getElementById('editor');
    expect.soft(editor).toBeVisible();
    expect.soft(editor).toHaveAttribute('contenteditable');
    expect.soft(document.querySelector('input[name=images]')).toBeInTheDocument();
    expect.soft(document.querySelector('input[name=video]')).toBeInTheDocument();
  });

  it('should render error text', async () => {
    render(Component, {
      userPicture: '',
      errorText: 'Error',
    });
    expect.soft(page.getByText('Error', { exact: true })).toBeInTheDocument();
  });
});

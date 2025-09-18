import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from '@/routes/(app)/post/[id]/+page.svelte';

describe('post detail page', () => {
  it('should render all default elements', async () => {
    render(Page, {
      data: {
        self: {
          profilePicture: '',
          displayName: 'Test',
          username: 'test',
        },
        post: {
          id: 123,
          content: 'example content',
          mediaPaths: ['image/url'],
          reaction: 'like',
          reactionCount: 1,
          replyCount: 0,
          dateCreated: '',
          owner: {
            profilePicture: '',
            displayName: 'Owner',
            username: 'owner',
          },
        },
      },
    });
    expect.soft(document.querySelector('.post-container')).toContainHTML('Post');
    expect.soft(document.querySelector('#post-123')).toBeVisible();
    expect.soft(page.getByText('@owner', { exact: true })).toBeVisible();
    expect.soft(page.getByText('example content', { exact: true })).toBeVisible();
    expect.soft(document.querySelectorAll('#post-123 img').length).toBe(2);
    expect.soft(document.querySelector('.dropdown-menu')).toBeInTheDocument();

    const editor = document.getElementById('editor');
    expect.soft(editor).toBeVisible();
    expect.soft(editor).toHaveAttribute('contenteditable');
    expect.soft(document.querySelector('input[name=images]')).toBeInTheDocument();
    expect.soft(document.querySelector('input[name=video]')).toBeInTheDocument();
  });

  it('should render its parent correctly', async () => {
    render(Page, {
      data: {
        self: {
          profilePicture: '',
          displayName: 'Test',
          username: 'test',
        },
        post: {
          id: 123,
          content: 'example content',
          mediaPaths: [],
          reaction: 'like',
          reactionCount: 1,
          replyCount: 0,
          dateCreated: '',
          owner: {
            profilePicture: '',
            displayName: 'Owner',
            username: 'owner',
          },
          parentPost: {
            id: 122,
            content: 'example post',
            mediaPaths: [],
            reaction: 'like',
            reactionCount: 1,
            replyCount: 1,
            dateCreated: '',
            owner: {
              profilePicture: '',
              displayName: 'Test',
              username: 'test',
            },
          },
        },
      },
    });
    expect.soft(document.querySelector('.post-container')).toContainHTML('Reply');
    expect.soft(document.querySelector('#post-123')).toBeVisible();
    expect.soft(document.querySelector('#post-122')).toBeVisible();
  });
});

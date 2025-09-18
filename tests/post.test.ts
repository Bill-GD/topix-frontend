import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Component from '$lib/components/Post.svelte';

describe('post component', () => {
  it('should render all default elements', async () => {
    render(Component, {
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
        owner: {
          profilePicture: '',
          displayName: 'Owner',
          username: 'owner',
        },
        dateCreated: '',
      },
    });
    expect.soft(document.querySelector('#post-123')).toBeVisible();
    expect.soft(page.getByText('example content', { exact: true })).toBeVisible();
    expect.soft(page.getByText('@owner', { exact: true })).toBeVisible();
    expect.soft(page.getByAltText('profile')).toBeVisible();
    expect.soft(document.querySelectorAll('img').length).toBe(2);
    expect.soft(document.querySelector('.dropdown-menu')).toBeInTheDocument();
  });

  it('should render its options correctly', async () => {
    render(Component, {
      self: {
        profilePicture: '',
        displayName: 'Test',
        username: 'test',
      },
      parent: true,
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
          owner: {
            profilePicture: '',
            displayName: 'Owner',
            username: 'owner',
          },
          dateCreated: '',
        },
      },
    });
    expect.soft(document.querySelector('#post-123')).toBeVisible();
    expect.soft(document.querySelector('.dropdown-menu')).not.toBeInTheDocument();
    expect.soft(page.getByText('replied to')).toBeVisible();
  });
});

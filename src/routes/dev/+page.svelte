<script lang="ts">
  import { Button } from '$lib/components/button';
  import { Icon, ReturnHeader } from '$lib/components/misc';
  import { Post } from '$lib/components/post';
  import { Toast } from '$lib/components/toast';
  import { getTheme } from '$lib/utils/theme.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const theme = getTheme();
</script>

<svelte:head>
  <title>Dev page</title>
</svelte:head>

<div class="flex flex-col gap-4 p-4">
  <Button class="absolute top-4 right-4 z-1 p-2" onclick={() => theme.toggle()}>
    <Icon class="text-zinc-800 dark:text-zinc-300" type={theme.isDark ? 'moon' : 'sun'} />
  </Button>

  <div class="flex flex-wrap gap-4">
    <Button class="px-4" type="base">Base</Button>
    <Button type="base" outline>Base</Button>
    <Button type="base" disabled>Base</Button>
    <Button type="base" outline disabled>Base</Button>

    <Button type="primary">Primary</Button>
    <Button type="primary" outline>Primary</Button>
    <Button type="primary" disabled>Primary</Button>
    <Button type="primary" outline disabled>Primary</Button>

    <Button type="success">Success</Button>
    <Button type="success" outline>Success</Button>
    <Button type="success" disabled>Success</Button>
    <Button type="success" outline disabled>Success</Button>

    <Button type="danger">Danger</Button>
    <Button type="danger" outline>Danger</Button>
    <Button type="danger" disabled>Danger</Button>
    <Button type="danger" outline disabled>Danger</Button>
  </div>

  <div class="flex gap-4">
    <Button><Icon type="add" size="sm" /></Button>
    <Button disabled><Icon type="add" size="sm" /></Button>
    <Button outline><Icon type="add" size="sm" /></Button>
    <Button outline disabled><Icon type="add" size="sm" /></Button>

    <Button type="base"><Icon type="add" size="sm" /></Button>
    <Button type="base" disabled><Icon type="add" size="sm" /></Button>
    <Button type="base" outline><Icon type="add" size="sm" /></Button>
    <Button type="base" outline disabled><Icon type="add" size="sm" /></Button>

    <Button type="primary"><Icon type="add" size="sm" /></Button>
    <Button type="primary" disabled><Icon type="add" size="sm" /></Button>
    <Button type="primary" outline><Icon type="add" size="sm" /></Button>
    <Button type="primary" outline disabled><Icon type="add" size="sm" /></Button>

    <Button type="success"><Icon type="add" size="sm" /></Button>
    <Button type="success" disabled><Icon type="add" size="sm" /></Button>
    <Button type="success" outline><Icon type="add" size="sm" /></Button>
    <Button type="success" outline disabled><Icon type="add" size="sm" /></Button>

    <Button type="danger"><Icon type="add" size="sm" /></Button>
    <Button type="danger" disabled><Icon type="add" size="sm" /></Button>
    <Button type="danger" outline><Icon type="add" size="sm" /></Button>
    <Button type="danger" outline disabled><Icon type="add" size="sm" /></Button>
  </div>

  <div class="flex gap-4">
    <Toast
      toast={{
        id: 1,
        message: 'Toast message',
        type: 'success',
      }}
      persistent
    />
    <Toast
      toast={{
        id: 1,
        message: 'Toast message',
        type: 'info',
      }}
      persistent
    />
    <Toast
      toast={{
        id: 1,
        message: 'Toast message',
        type: 'error',
      }}
      persistent
    />
  </div>

  <Post
    self={data.self}
    post={{
      id: 0,
      content: 'example content',
      mediaPaths: [],
      reaction: 'like',
      reactionCount: 1,
      replyCount: 0,
      dateCreated: '',
      dateUpdated: '',
      owner: {
        id: 1,
        profilePicture: '',
        displayName: 'Owner',
        username: 'owner',
      },
      threadId: 0,
      threadOwnerId: 0,
      threadTitle: 'Thread title',
      threadVisibility: 'public',
      groupId: null,
      groupName: null,
      groupApproved: false,
      groupVisibility: 'public',
      joinedGroup: true,
      tag: null,
      visibility: 'public',
      parentPost: {
        id: 0,
        content: 'example post',
        mediaPaths: [],
        reaction: 'like',
        reactionCount: 0,
        replyCount: 0,
        owner: {
          id: 0,
          profilePicture: '',
          displayName: 'Owner',
          username: 'owner',
        },
        threadId: 0,
        threadOwnerId: 0,
        threadTitle: 'Thread title',
        threadVisibility: 'public',
        groupId: null,
        groupName: null,
        groupApproved: false,
        groupVisibility: 'public',
        joinedGroup: true,
        tag: null,
        visibility: 'public',
        dateCreated: '',
        dateUpdated: '',
      },
    }}
    showThreadAndGroupName
  />

  <ReturnHeader>Return</ReturnHeader>
</div>

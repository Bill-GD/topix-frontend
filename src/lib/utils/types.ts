// general types

import type { AxiosResponseHeaders } from 'axios';

export const CookieName = {
  accessToken: '_at',
  refreshToken: '_rt',
  currentUser: '_self',
  oauthUserInfo: 'google_oauth_info',
} as const;

export const NotificationActions = {
  react: 'react',
  updateThread: 'update_thread',
  follow: 'follow',
} as const;

export type NotificationTypes = (typeof NotificationActions)[keyof typeof NotificationActions];

export type ApiResponse = {
  readonly headers: AxiosResponseHeaders;
  readonly success: boolean;
  readonly message: string;
  readonly status: number;
  readonly error: string | object | null;
  readonly data: Record<string, unknown> | string[] | null;
};

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
};

export type CurrentUser = {
  id: number;
  username: string;
  displayName: string;
  profilePicture: string | null;
  role: 'user' | 'admin';
};

export type User = {
  id: number;
  username: string;
  displayName: string;
  description: string | null;
  profilePicture: string | null;
  followerCount: number;
  followingCount: number;
  followed: boolean;
  chatChannelId: number | null;
  role: 'user' | 'admin';
};

export type Owner = {
  id: number;
  username: string;
  displayName: string;
  profilePicture: string | null;
};

export type Tag = {
  id: number;
  name: string;
  color: string;
};

export type Post = {
  id: number;
  owner: Owner;
  content: string;
  reaction: string | null;
  reactionCount: number;
  replyCount: number;
  mediaPaths: string[];
  parentPost?: Post;
  threadId: number | null;
  threadTitle: string | null;
  threadOwnerId: number | null;
  threadVisibility: 'public' | 'private' | 'hidden';
  groupId: number | null;
  groupName: string | null;
  groupVisibility: 'public' | 'private' | 'hidden';
  joinedGroup: boolean | null;
  tag: Tag | null;
  groupApproved: boolean;
  visibility: 'public' | 'private' | 'hidden';
  dateCreated: string;
  dateUpdated: string | null;
};

export type Thread = {
  id: number;
  title: string;
  owner: Owner;
  postCount: number;
  groupId: number | null;
  groupName: string | null;
  groupVisibility: 'public' | 'private' | 'hidden';
  joinedGroup: boolean | null;
  tag: Tag | null;
  visibility: 'public' | 'private' | 'hidden';
  followed: boolean;
  dateCreated: string;
  dateUpdated: string | null;
};

export type Group = {
  id: number;
  name: string;
  owner: Owner;
  bannerPicture: string | null;
  memberCount: number;
  description: string | null;
  visibility: 'public' | 'private' | 'hidden';
  status: boolean | null;
  dateJoined: string | null;
  dateCreated: string;
  dateUpdated: string | null;
};

export type ChatChannel = {
  id: number;
  firstUser: Owner | null;
  secondUser: Owner | null;
  lastMessage: string | null;
  newMessageCount: number;
  lastSentAt: string | null;
  dateCreated: string;
};

export type ChatMessage = {
  id: number;
  sender: Owner;
  content: string;
  sentAt: string;
};

export type Notification = {
  id: string;
  actor: Owner;
  actorCount: number;
  actionType: NotificationTypes;
  objectId: number;
  receiverId: number;
  dateCreated: string;
  postContent: string | null;
  threadTitle: string | null;
};

export type UnaryVoidFunction<T> = (arg: T) => void;

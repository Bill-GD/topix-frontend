// general types

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error';
};

export type ApiResponse = {
  readonly success: boolean;
  readonly message: string;
  readonly status: number;
  readonly error: string | object | null;
  readonly data: Record<string, unknown> | string[] | null;
};

export const CookieName = {
  accessToken: '_at',
  refreshToken: '_rt',
  currentUser: '_self',
} as const;

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
  dateUpdated: string;
};

export type UnaryVoidFunction<T> = (arg: T) => void;

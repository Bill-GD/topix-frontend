// general types

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
} as const;

export type User = {
  id: number;
  username: string;
  displayName: string;
  description: string | null;
  profilePicture: string | null;
  followerCount: number;
  followingCount: number;
  role: 'user' | 'admin';
};

export type Post = {
  id: number;
  owner: User;
  // parentPostId: number;
  // threadId: number;
  // groupId: number;
  // tag: string;
  content: string;
  groupAccepted: boolean;
  visibility: 'public' | 'private' | 'hidden';
  reactionCount: number;
  replyCount: number;
  mediaPaths: string[];
  dateCreated: string;
};

export type UnaryVoidFunction<T> = (arg: T) => void;

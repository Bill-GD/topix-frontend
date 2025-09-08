// general types

export type ApiResponse = {
  readonly success: boolean;
  readonly message: string;
  readonly status: number;
  readonly error: string | object | null;
  readonly data: Record<string, unknown> | null;
};

export const CookieName = {
  accessToken: '_at',
  refreshToken: '_rt',
} as const;

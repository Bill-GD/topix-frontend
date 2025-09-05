// general types

export type ApiResponse = {
  readonly success: boolean;
  readonly message: string;
  readonly status: number;
  readonly error: string | object | null;
  readonly data: object | null;
};

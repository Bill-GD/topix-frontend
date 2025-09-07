import axios, { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { getApiUrl } from './helpers';
import { type ApiResponse } from './types';

export class AxiosHandler {
  private static API_URL = getApiUrl();

  static async get(url: string, headers?: AxiosHeaders): Promise<ApiResponse> {
    let res: ApiResponse;

    try {
      res = this.getResponse(
        await axios.get(url, {
          baseURL: this.API_URL,
          headers: {
            Accept: 'application/json',
            ...headers,
          },
        }),
      );
    } catch (error) {
      res = this.handleError(error);
    }

    return res;
  }

  static async post(url: string, dto?: object, headers?: AxiosHeaders): Promise<ApiResponse> {
    let res: ApiResponse;

    try {
      res = this.getResponse(
        await axios.post(url, dto, {
          baseURL: this.API_URL,
          headers: {
            Accept: 'application/json',
            ...headers,
          },
        }),
      );
    } catch (error) {
      res = this.handleError(error);
    }

    return res;
  }

  private static handleError(error: unknown): ApiResponse {
    if (error instanceof AxiosError && error.response) {
      return this.getResponse(error.response!);
    }

    const typed = error as Error;
    console.error(typed.cause);
    return {
      success: false,
      status: 500,
      data: null,
      error: typed.name,
      message: typed.message,
    };
  }

  private static getResponse(res: AxiosResponse): ApiResponse {
    return res.data as ApiResponse;
  }
}

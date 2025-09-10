import axios, { AxiosError, type AxiosResponse, type RawAxiosRequestHeaders } from 'axios';
import { getApiUrl } from './helpers';
import { type ApiResponse } from './types';

export class AxiosHandler {
  private static API_URL = getApiUrl();

  static async get(
    url: string,
    token?: string,
    headers?: RawAxiosRequestHeaders,
  ): Promise<ApiResponse> {
    let res: ApiResponse;

    try {
      res = this.getResponse(await this.request('get', url, null, token, headers));
    } catch (error) {
      res = this.handleError(error);
    }

    return res;
  }

  static async post(
    url: string,
    dto?: object,
    token?: string,
    headers?: RawAxiosRequestHeaders,
  ): Promise<ApiResponse> {
    let res: ApiResponse;

    try {
      res = this.getResponse(await this.request('post', url, dto ?? null, token, headers));
    } catch (error) {
      res = this.handleError(error);
    }

    return res;
  }

  static async patch(
    url: string,
    dto: object,
    token?: string,
    headers?: RawAxiosRequestHeaders,
  ): Promise<ApiResponse> {
    let res: ApiResponse;

    try {
      res = this.getResponse(await this.request('patch', url, dto, token, headers));
    } catch (error) {
      res = this.handleError(error);
    }

    return res;
  }

  static async delete(
    url: string,
    token?: string,
    headers?: RawAxiosRequestHeaders,
  ): Promise<ApiResponse> {
    let res: ApiResponse;

    try {
      res = this.getResponse(await this.request('delete', url, null, token, headers));
    } catch (error) {
      res = this.handleError(error);
    }

    return res;
  }

  private static request(
    method: string,
    url: string,
    dto: object | null,
    token?: string,
    headers?: RawAxiosRequestHeaders,
  ) {
    return axios(url, {
      method,
      data: dto ?? undefined,
      baseURL: this.API_URL,
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
        ...headers,
      },
      withCredentials: true,
    });
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

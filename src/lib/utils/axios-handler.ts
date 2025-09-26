import axios, { AxiosError, type AxiosResponse, type RawAxiosRequestHeaders } from 'axios';
import { getApiUrl } from './helpers';
import { CookieName, type ApiResponse } from './types';
import { fail, type RequestEvent } from '@sveltejs/kit';

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

  private static handleError(err: unknown): ApiResponse {
    const error = err as Error;

    if (error instanceof AxiosError && error.response) {
      return this.getResponse(error.response!);
    }

    if (error.name === 'AggregateError') {
      const typed = error as AggregateError;
      if (typed.code.includes('ECONNREFUSED')) {
        return {
          success: false,
          status: 503,
          data: null,
          error: typed.code,
          message: 'Server is down.',
        };
      }
    }

    console.log(error.cause);
    return {
      success: false,
      status: 500,
      data: null,
      error: error.name,
      message: error.message,
    };
  }

  private static getResponse(res: AxiosResponse): ApiResponse {
    return res.data as ApiResponse;
  }
}

export async function handleReaction(event: RequestEvent) {
  const formData = await event.request.formData();
  const reaction = formData.get('reaction');
  const postId = Number(formData.get('post-id'));

  let res: ApiResponse;

  if (reaction === 'noReaction') {
    res = await AxiosHandler.delete(
      `/post/${postId}/react`,
      event.cookies.get(CookieName.accessToken),
    );
  } else {
    res = await AxiosHandler.patch(
      `/post/${postId}/react`,
      { reaction: `${reaction}` },
      event.cookies.get(CookieName.accessToken),
    );
  }

  if (!res.success) return fail(res.status, { success: false, message: res.message });
  // return { success: true, message: res.message };
}

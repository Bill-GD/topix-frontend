import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import axios, { AxiosError } from 'axios';
import { getApiUrl } from '@/lib/utils/helpers';
import type { ApiResponse } from '@/lib/utils/types';

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();

    const dto = {
      email: `${formData.get('email')}`,
      username: `${formData.get('username')}`,
      password: `${formData.get('password')}`,
      confirmPassword: `${formData.get('confirm-password')}`,
    };

    for (const v of Object.values(dto)) {
      if (v.length <= 0) {
        return fail(400, { missing: true });
      }
    }

    const emailRegex =
      /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/;

    if (!RegExp(emailRegex).test(dto.email)) {
      return fail(400, { email: true });
    }

    try {
      await axios.post('/auth/register', dto, {
        baseURL: getApiUrl(),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return fail(error.response?.status ?? 500, error.response?.data as ApiResponse);
      }
      console.error(error);
    }
  },
};

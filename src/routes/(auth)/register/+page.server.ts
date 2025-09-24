import { AxiosHandler } from '$lib/utils/axios-handler';
import { capitalize } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

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
        return fail(400, {
          success: false,
          message: 'All fields must not be empty.',
        });
      }
    }

    const emailRegex =
      /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/;

    if (!RegExp(emailRegex).test(dto.email)) {
      return fail(400, { success: false, message: 'Email format is invalid.' });
    }

    const res = await AxiosHandler.post('/auth/register', dto);
    if (!res.success) {
      let message = res.message;
      if (res.message.toLowerCase().includes('exception')) {
        if (res.error instanceof Array) message = capitalize(res.error[0]);
        if (typeof res.error === 'string') message = res.error;
      }
      return fail(res.status, { success: false, message });
    }

    return redirect(303, `/verify/${(res.data as Record<string, string>)['id']}`);
  },
};

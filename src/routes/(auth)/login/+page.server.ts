import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AxiosHandler } from '@/lib/utils/axios-handler';
import { capitalize } from '@/lib/utils/helpers';

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();

    const dto = {
      username: `${formData.get('username')}`,
      password: `${formData.get('password')}`,
    };

    const { username } = dto;

    for (const v of Object.values(dto)) {
      if (v.length <= 0) {
        return fail(400, { username, missing: true });
      }
    }

    const res = await AxiosHandler.post('/auth/login', dto);
    if (!res.success) {
      let message = res.message;
      if (res.message.toLowerCase().includes('exception')) {
        if (res.error instanceof Array) message = capitalize(res.error[0]);
        if (typeof res.error === 'string') message = res.error;
      }
      return fail(res.status, { username, ...res, message });
    }

    console.log(res.data);

    return redirect(303, '/home');
  },
};

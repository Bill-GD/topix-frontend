import { AxiosHandler } from '$lib/utils/axios-handler';
import { capitalize } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  otp: async (event) => {
    const formData = await event.request.formData();

    const dto = {
      otp: `${formData.get('otp')}`,
    };

    if (dto.otp.length <= 0) {
      return fail(400, { success: false, message: 'You must enter the code.' });
    }

    const res = await AxiosHandler.post(`/auth/confirm/${event.params.id}`, dto);

    if (!res.success) {
      let message = res.message;
      if (res.message.toLowerCase().includes('exception')) {
        if (res.error instanceof Array) message = capitalize(res.error[0]);
        if (typeof res.error === 'string') message = res.error;
      }
      return fail(res.status, { success: false, message });
    }

    return redirect(303, '/login');
  },
  resend: async (event) => {
    const res = await AxiosHandler.post(`/auth/resend/${event.params.id}`);

    if (!res.success) {
      let message = res.message;
      if (res.message.toLowerCase().includes('exception')) {
        if (res.error instanceof Array) message = capitalize(res.error[0]);
        if (typeof res.error === 'string') message = res.error;
      }
      return fail(res.status, { success: false, message });
    }

    return { success: true, message: 'The code has been resent. Please check your email.' };
  },
};

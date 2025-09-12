import { AxiosHandler } from '@/lib/utils/axios-handler';
import { dataUrlToFile } from '@/lib/utils/helpers';
import { CookieName } from '@/lib/utils/types';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    console.log(formData);

    // const dto = {
    //   username: formData.get('username'),
    // };

    // const res = await AxiosHandler.patch(
    //   `/user/me`,
    //   dto,
    //   event.cookies.get(CookieName.accessToken),
    // );
    // if (res.success)
    return { success: true, message: 'Saved successfully!' };
    // return fail(res.status, { success: false, message: res.message });
  },
};

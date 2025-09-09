import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  'update-account': async (event) => {
    const formData = await event.request.formData();
    console.log(formData);
    return { success: true };
  },
  'update-profile': async (event) => {
    const formData = await event.request.formData();
    console.log(formData);
    return { success: true };
  },
  'delete-account': async (event) => {
    const formData = await event.request.formData();
    console.log(formData);
    return { success: true };
  },
};

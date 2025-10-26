import type { Notification } from '$lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    notifications: [
      {
        id: '1:react:null',
        actor: {
          id: 8,
          displayName: 'tester',
          username: 'tester',
          profilePicture:
            'https://res.cloudinary.com/djqtcdphf/image/upload/v1759319357/crxvrj0ky6tl9j73eqko.png',
        },
        type: 'follow',
        objectId: null,
        dateCreated: '2025-10-24T20:15:12Z',
      },
      {
        id: '1:follow:209',
        actor: {
          id: 8,
          displayName: 'tester',
          username: 'tester',
          profilePicture:
            'https://res.cloudinary.com/djqtcdphf/image/upload/v1759319357/crxvrj0ky6tl9j73eqko.png',
        },
        type: 'react',
        objectId: 209,
        dateCreated: '2025-10-22T12:15:12Z',
      },
    ] as Notification[],
  };
};

import type { Post } from '@/lib/utils/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    post: {
      id: 3,
      content: 'Example',
      reactionCount: 10,
      replyCount: 0,
      mediaPaths: [
        'https://res.cloudinary.com/djqtcdphf/image/upload/v1757847439/imbaepwbaqhcdjxepu5j.gif',
      ],
    } as Partial<Post>,
  };
};

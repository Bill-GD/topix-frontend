// component-related types

import { faThumbsUp as faRegularThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faFaceAngry } from '@fortawesome/free-solid-svg-icons/faFaceAngry';
import { faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons/faFaceFrownOpen';
import { faFaceLaugh } from '@fortawesome/free-solid-svg-icons/faFaceLaugh';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { faMessage } from '@fortawesome/free-solid-svg-icons/faMessage';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons/faUserMinus';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faVideo } from '@fortawesome/free-solid-svg-icons/faVideo';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

export type ButtonType = 'primary' | 'danger' | 'dark' | 'success';

export const Icons = {
  sun: faSun,
  moon: faMoon,
  lock: faLock,
  edit: faPen,
  delete: faTrashCan,
  user: faUser,
  bar: faBars,
  success: faCircleCheck,
  check: faCheck,
  unfollow: faUserMinus,
  follow: faUserPlus,
  add: faPlus,
  video: faVideo,
  image: faImage,
  back: faChevronLeft,
  next: faChevronRight,
  eye: faEye,
  eyeSlash: faEyeSlash,
  error: faTriangleExclamation,
  home: faHouse,
  search: faMagnifyingGlass,
  group: faUserGroup,
  message: faMessage,
  reply: faReply,
  menu: faEllipsisH,
  close: faXmark,
  noReaction: faRegularThumbsUp,
  like: faThumbsUp,
  heart: faHeart,
  laugh: faFaceLaugh,
  sad: faFaceFrownOpen,
  angry: faFaceAngry,
} as const;

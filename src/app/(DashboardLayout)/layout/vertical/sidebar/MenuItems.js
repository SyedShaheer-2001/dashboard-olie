import { uniqueId } from 'lodash';

import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconAperture,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconAperture,
    href: '/',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconAperture,
    href: '/users',
  },
   {
    id: uniqueId(),
    title: 'Privacy policies',
    icon: IconAperture,
    href: '/privacy-policies',
  },
  {
    id: uniqueId(),
    title: 'Terms and Conditions',
    icon: IconAperture,
    href: '/terms-conditions',
  },
  {
    id: uniqueId(),
    title: 'FAQ',
    icon: IconAperture,
    href: '/faq',
  },
  {
    id: uniqueId(),
    title: 'Interests',
    icon: IconAperture,
    href: '/interests',
  },
  {
    id: uniqueId(),
    title: 'Posts',
    icon: IconAperture,
    href: '/posts',
  },
  {
    id: uniqueId(),
    title: 'Categories',
    icon: IconAperture,
    href: '/categories',
  },
   {
    id: uniqueId(),
    title: 'Events',
    icon: IconAperture,
    href: '/events',
  },
    {
    id: uniqueId(),
    title: 'Credits',
    icon: IconAperture,
    href: '/credits',
  }
  // {
  //   id: uniqueId(),
  //   title: 'Sample ',
  //   icon: IconAperture,
  //   href: '/sample-page',
  // },
  
  // Menu items sidebar items

];

export default Menuitems;

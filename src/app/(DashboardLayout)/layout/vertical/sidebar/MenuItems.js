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
    chip: 'New',
    chipColor: 'secondary',
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
  // {
  //   id: uniqueId(),
  //   title: 'Sample ',
  //   icon: IconAperture,
  //   href: '/sample-page',
  // },
  
  // Menu items sidebar items

];

export default Menuitems;

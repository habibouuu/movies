// third-party
import { FormattedMessage } from 'react-intl';

// types
import { NavItemType } from 'types';

// assets
import {
  IconApps,
  IconUserCheck,
  IconBasket,
  IconMessages,
  IconFileInvoice,
  IconLayoutKanban,
  IconMail,
  IconCalendar,
  IconNfc
} from '@tabler/icons-react';

// constant
const icons = {
  IconApps,
  IconUserCheck,
  IconBasket,
  IconMessages,
  IconFileInvoice,
  IconLayoutKanban,
  IconMail,
  IconCalendar,
  IconNfc
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const application: NavItemType = {
  id: 'movies',
  title: <FormattedMessage id="movies" />,
  icon: icons.IconApps,
  type: 'group',
  children: [
    {
      id: 'mov-comedy',
      title: 'Comedy',
      type: 'item',
      icon: icons.IconLayoutKanban,
      url: '/movies/comedy',
      breadcrumbs: false
    },
    {
      id: 'mov-action',
      title: <FormattedMessage id="Action" />,
      type: 'item',
      icon: icons.IconMail,
      url: '/movies/action'
    },
    {
      id: 'mov-drama',
      title: <FormattedMessage id="Drama" />,
      type: 'item',
      url: '/movies/drama',
      icon: icons.IconCalendar
    },
    
  ]
};

export default application;

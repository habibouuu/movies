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
  id: 'application',
  title: <FormattedMessage id="application" />,
  icon: icons.IconApps,
  type: 'group',
  children: [
    {
      id: 'kanban',
      title: 'Kanban',
      type: 'item',
      icon: icons.IconLayoutKanban,
      url: '/apps/kanban/board',
      breadcrumbs: false
    },
    {
      id: 'mail',
      title: <FormattedMessage id="mail" />,
      type: 'item',
      icon: icons.IconMail,
      url: '/apps/mail'
    },
    {
      id: 'calendar',
      title: <FormattedMessage id="calendar" />,
      type: 'item',
      url: '/apps/calendar',
      icon: icons.IconCalendar
    },
    
  ]
};

export default application;

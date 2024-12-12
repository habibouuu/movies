// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

const icons = {
  IconDashboard: IconDashboard,
  IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'home',
  title: <FormattedMessage id="home" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'trending',
      title: <FormattedMessage id="Trending" />,
      type: 'item',
      url: '/',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: "upcoming",
      title: <FormattedMessage id="Upcoming" />,
      type: 'item',
      url: '/upcoming',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    }
  ]
};

export default dashboard;

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import SwitchAccessShortcutOutlinedIcon from '@mui/icons-material/SwitchAccessShortcutOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
const icons = {
  IconDashboard,
  IconDeviceAnalytics,
  SwitchAccessShortcutOutlinedIcon,
  TrendingUpOutlinedIcon,
  HomeOutlinedIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'home',
  title: <FormattedMessage id="home" />,
  icon: icons.HomeOutlinedIcon,
  type: 'group',
  children: [
    {
      id: 'trending',
      title: <FormattedMessage id="Trending" />,
      type: 'item',
      url: '/',
      icon: icons.TrendingUpOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: "upcoming",
      title: <FormattedMessage id="Upcoming" />,
      type: 'item',
      url: '/upcoming',
      icon: icons.SwitchAccessShortcutOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;

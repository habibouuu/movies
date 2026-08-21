// types
import { NavItemType } from 'types';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';

const icons = {
  PersonOutlineOutlinedIcon,
  HistoryOutlinedIcon,
  FavoriteBorderOutlinedIcon,
  WatchLaterOutlinedIcon
};

// ==============================|| MENU ITEMS - USER ||============================== //

const user: NavItemType = {
  id: 'user',
  title: 'User',
  icon: icons.PersonOutlineOutlinedIcon,
  type: 'group',
  children: [
    {
      id: 'watch-history',
      title: 'Watch History',
      type: 'item',
      url: '/history',
      icon: icons.HistoryOutlinedIcon
    },
    {
      id: 'favorites',
      title: 'Favorites',
      type: 'item',
      url: '/favorites',
      icon: icons.FavoriteBorderOutlinedIcon
    },
    {
      id: 'watch-later',
      title: 'Watch Later',
      type: 'item',
      url: '/watchlater',
      icon: icons.WatchLaterOutlinedIcon
    }
  ]
};

export default user;

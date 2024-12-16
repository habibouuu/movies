// third-party
import { FormattedMessage } from 'react-intl';

// types
import { NavItemType } from 'types';
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
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
  IconNfc,
  TheaterComedyOutlinedIcon,
  MovieCreationOutlinedIcon,
  SentimentVeryDissatisfiedOutlinedIcon,
// assets
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
      icon: icons.TheaterComedyOutlinedIcon,
      url: '/movies/comedy',
      breadcrumbs: false
    },
    {
      id: 'mov-action',
      title: <FormattedMessage id="Action" />,
      type: 'item',
      icon: icons.MovieCreationOutlinedIcon,
      url: '/movies/action'
    },
    {
      id: 'mov-drama',
      title: <FormattedMessage id="Drama" />,
      type: 'item',
      url: '/movies/drama',
      icon: icons.SentimentVeryDissatisfiedOutlinedIcon
    },
    
  ]
};

export default application;

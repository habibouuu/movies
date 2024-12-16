// third-party
import { FormattedMessage } from 'react-intl';

// types
import { NavItemType } from 'types';
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
// assets
import {
  IconClipboardCheck,
  IconPictureInPicture,
  IconForms,
  IconBorderAll,
  IconChartDots,
  IconStairsUp,
  IconMapPin,
  IconTable
} from '@tabler/icons-react';

// constant
const icons = {
  IconClipboardCheck,
  IconPictureInPicture,
  IconForms,
  IconBorderAll,
  IconChartDots,
  IconStairsUp,
  IconMapPin,
  IconTable,
  TheaterComedyOutlinedIcon,
  MovieCreationOutlinedIcon,
  SentimentVeryDissatisfiedOutlinedIcon,
  
};

// ==============================|| UI FORMS MENU ITEMS ||============================== //

const forms: NavItemType = {
  id: 'tv-shows',
  title: <FormattedMessage id="tv-shows" />,
  icon: icons.IconPictureInPicture,
  type: 'group',
  children: [
    {
      id: 'tv-comedy',
      title: <FormattedMessage id="Comedy" />,
      type: 'item',
      url: '/tv/comedy',
      icon: icons.TheaterComedyOutlinedIcon,
    },
    {
      id: 'tv-action',
      title: <FormattedMessage id="Action" />,
      type: 'item',
      url: '/tv/action',
      icon: icons.MovieCreationOutlinedIcon,
    },
    {
      id: 'tv-drama',
      title: <FormattedMessage id="Drama" />,
      type: 'item',
      url: '/tv/drama',
      icon: icons.SentimentVeryDissatisfiedOutlinedIcon,

    }
  ]
};

export default forms;

// third-party
import { FormattedMessage } from 'react-intl';

// types
import { NavItemType } from 'types';

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
  IconTable
};

// ==============================|| UI FORMS MENU ITEMS ||============================== //

const forms: NavItemType = {
  id: 'tv-shows',
  title: <FormattedMessage id="tv-shows" />,
  icon: icons.IconPictureInPicture,
  type: 'group',
  children: [
    {
      id: 'comedy',
      title: <FormattedMessage id="Comedy" />,
      type: 'item',
      url: '/tv/comedy',
      icon: icons.IconMapPin
    },
    {
      id: 'action',
      title: <FormattedMessage id="Action" />,
      type: 'item',
      url: '/tv/action',
      icon: icons.IconClipboardCheck
    },
    {
      id: 'drama',
      title: <FormattedMessage id="Drama" />,
      type: 'item',
      url: '/tv/drama',
      icon: icons.IconStairsUp
    }
  ]
};

export default forms;

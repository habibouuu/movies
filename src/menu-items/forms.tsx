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
  id: 'ui-forms',
  title: <FormattedMessage id="forms" />,
  icon: icons.IconPictureInPicture,
  type: 'group',
  children: [
    {
      id: 'map',
      title: <FormattedMessage id="map" />,
      type: 'item',
      icon: icons.IconMapPin,
      url: '/forms/map'
    },
    {
      id: 'forms-validation',
      title: <FormattedMessage id="forms-validation" />,
      type: 'item',
      url: '/forms/forms-validation',
      icon: icons.IconClipboardCheck
    },
    {
      id: 'forms-wizard',
      title: <FormattedMessage id="forms-wizard" />,
      type: 'item',
      url: '/forms/forms-wizard',
      icon: icons.IconStairsUp
    }
  ]
};

export default forms;

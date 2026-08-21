// menu import
import dashboard from './dashboard';
import application from './application';
import forms from './forms';
import user from './user';
// import elements from './elements';
// import samplePage from './sample-page';
// import pages from './pages';
// import utilities from './utilities';
// import support from './support';
// import other from './other';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, application, forms, user]
};

export default menuItems;

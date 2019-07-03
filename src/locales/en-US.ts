import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import login from './en-US/login';
import account from './en-US/account';
export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...pwa,
  ...component,
  ...login,
  ...account 
};

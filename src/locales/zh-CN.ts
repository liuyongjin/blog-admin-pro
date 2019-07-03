import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import login from './zh-CN/login';
import account from './zh-CN/account';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...pwa,
  ...component,
  ...login,
  ...account
};

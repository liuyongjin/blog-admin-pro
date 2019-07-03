import { Avatar, Icon, Menu, Spin } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { ClickParam } from 'antd/es/menu';
import { CurrentUser } from '@/models/user';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { BASE_URL } from '@/utils/utils';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'logout/logout',
        });
      }

      return;
    }
    router.push(`/account`);
  };

  render(): React.ReactNode {
    const { currentUser = {} } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="settings">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser.nickname ? (
      <HeaderDropdown overlay={menuHeaderDropdown} placement="bottomCenter">
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={BASE_URL+currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.nickname}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);

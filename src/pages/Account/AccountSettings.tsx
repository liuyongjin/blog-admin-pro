import React, { Component } from 'react';

// import { Dispatch } from 'redux';
import { connect } from 'dva';
import BaseView from './components/base';
import { CurrentUser } from '@/models/user';
import styles from './style.less';


interface AccountSettingsProps {
  currentUser: CurrentUser;
}

interface AccountSettingsState {

}
@connect(({ user }: { user: { currentUser: CurrentUser } }) => ({
  currentUser: user.currentUser,
}))
class AccountSettings extends Component<
AccountSettingsProps,
AccountSettingsState
> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: AccountSettingsProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { currentUser } = this.props;
    if (!currentUser.id) {
      return '';
    }
    return (
      <div
        className={styles.main}
      >
        <BaseView />
      </div>
    );
  }
}

export default AccountSettings;

import { ConnectProps, ConnectState } from '@/models/connect';

import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import React from 'react';
import SelectLang from '../SelectLang';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import router from 'umi/router';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder={formatMessage({
          id: 'component.globalHeader.search',
        })}
        dataSource={[
          {
            value: '/article',
            text: '文章管理'
          }, {
            value: '/tag',
            text: '标签管理'
          }, {
            value: '/account',
            text: '个人页'
          },
        ]}
        onSearch={value => {
          if (['/article', '/tag', '/account'].indexOf(value) !== -1) {
            router.push(value);
          }
        }}
        // onPressEnter={value => {
        //   // console.log('enter', value);
        // }}
      />
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);

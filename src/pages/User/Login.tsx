import { Alert, Checkbox} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginComponents;

interface PAGE_NAME_UPPER_CAMEL_CASEProps {
  dispatch: Dispatch<any>;
  BLOCK_NAME_CAMEL_CASE: StateType;
  submitting: boolean;
}
interface PAGE_NAME_UPPER_CAMEL_CASEState {
  type: string;
  autoLogin: boolean;
}
export interface FromDataType {
  userName: string;
  password: string;
}

@connect(
  ({
    BLOCK_NAME_CAMEL_CASE,
    loading,
  }: {
    BLOCK_NAME_CAMEL_CASE: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    BLOCK_NAME_CAMEL_CASE,
    submitting: loading.effects['BLOCK_NAME_CAMEL_CASE/login'],
  }),
)
class PAGE_NAME_UPPER_CAMEL_CASE extends Component<
  PAGE_NAME_UPPER_CAMEL_CASEProps,
  PAGE_NAME_UPPER_CAMEL_CASEState
> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: PAGE_NAME_UPPER_CAMEL_CASEState = {
    autoLogin: true,
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err: any, values: FromDataType) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'BLOCK_NAME_CAMEL_CASE/login',
        payload: {
          ...values,
        },
      });
    }
  };


  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { BLOCK_NAME_CAMEL_CASE, submitting } = this.props;
    const { status, type: loginType } = BLOCK_NAME_CAMEL_CASE;
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey="account"
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="">
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'BLOCK_NAME.login.message-invalid-credentials' }),
              )}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'BLOCK_NAME.login.userName' })}: admin or user`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'BLOCK_NAME.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'BLOCK_NAME.login.password' })}: 123`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'BLOCK_NAME.password.required' }),
                },
              ]}
              onPressEnter={() =>
                this.loginForm && this.loginForm.validateFields(this.handleSubmit)
              }
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="BLOCK_NAME.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="BLOCK_NAME.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default PAGE_NAME_UPPER_CAMEL_CASE;

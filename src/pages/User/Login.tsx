import { Alert} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  login: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
}
export interface FormDataType {
  username: string;
  password: string;
}

@connect(
  ({
    login,
    loading,
  }: {
    login: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    login,
    submitting: loading.effects['login/login'],
  }),
)
class Login extends Component<
  LoginProps,
  LoginState
> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type:''
  };


  handleSubmit = (err: any, values: FormDataType) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
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
    const { login, submitting } = this.props;
    const { status } = login;
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
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'login.login.message-invalid-credentials' }),
              )}
            <UserName
              name="username"
              placeholder={`${formatMessage({ id: 'login.login.username' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'login.username.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'login.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'login.password.required' }),
                }
              ]}
            />
          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;

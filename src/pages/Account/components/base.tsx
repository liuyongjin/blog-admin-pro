import { Button, Form, Input, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { CurrentUser } from '@/models/user';
import { Dispatch } from 'redux';

import styles from './BaseView.less';

import { getToken, BASE_URL } from '@/utils/utils';

const FormItem = Form.Item;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar,handleChange }: { avatar: string;handleChange:any }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="account.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={BASE_URL + avatar}/>
    </div>
    <Upload showUploadList={false} action={BASE_URL + "/api/v1/upload"} headers={{ 'token': getToken() }} onChange={handleChange}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="account.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);



interface BaseViewProps extends FormComponentProps {
  currentUser?: CurrentUser;
  dispatch: Dispatch<any>;
}

@connect(({ user }: { user: { currentUser: CurrentUser } }) => ({
  currentUser: user.currentUser,
}))
class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  componentDidMount() {
    this.getInfo();
    this.setBaseInfo();
  }

  getInfo(){
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }
  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
    }
    return '';
  }
  handleChange=(info:any)=>{
    const {file}=info;
    const { dispatch } = this.props;
    if (file.response&&file.response.data) {
      dispatch({
        type: 'account/modifyUserAvatar',
        payload: {avatar:file.response.data.file_url},
        callback: (response:any) => {
          this.getInfo();
          message.success(response.msg);
        }
      });
    }
  }
  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, dispatch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'account/modifyUserInfo',
          payload: fieldsValue,
          callback: (response:any) => {
            this.getInfo();
            form.setFieldsValue({password:null});
            message.success(response.msg);
          }
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={formatMessage({ id: 'account.basic.username' })}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account.basic.username-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'account.basic.nickname' })}>
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'account.basic.password' })}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'account.basic.password-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage id="account.basic.update" defaultMessage="Update Information" />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} handleChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

export default Form.create<BaseViewProps>()(BaseView);

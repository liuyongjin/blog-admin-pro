import { Form, Input, Modal, Switch, Upload, Button, Icon, Select } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import MarkdownEditor from './MarkdownEditor';

import { Dispatch } from 'redux';
import { StateType } from '../model';
import {getToken,BASE_URL} from '@/utils/utils';

const FormItem = Form.Item;

const { TextArea } = Input;
const { Option } = Select;

export interface fieldsValue {
  title: string;
  des: string;
  tags_id: number[];
  status: boolean;
  main_img: string;
  content: string;
}

export interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  article: StateType;
  handleAdd: (
    fieldsValue: fieldsValue,
  ) => void;
  handleModalVisible: () => void;
  dispatch: Dispatch<any>;
}


export interface CreateFormState {
  fileList:any[];
}

class CreateForm extends Component<CreateFormProps, CreateFormState> {
  static defaultProps = {

  };

  formLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
  };

  constructor(props: CreateFormProps) {
    super(props);

    this.state = {
      fileList:[]
    };
  }
  normFile = (e: any) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  handleChange = (info:any) => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response&&file.response.data) {
        // Component will show file.url as link
        file.url = file.response.data.file_url;
      }
      return file;
    });
    this.setState({fileList})
  };

  okHandle = () => {
    const {handleAdd,form}=this.props;
    form.validateFields((err, fieldsValue:any) => {
      if (err) return;
      let values:fieldsValue={
        ...fieldsValue,
        main_img:fieldsValue.main_img[0].url
      }
      // console.log(values);
      // return;
      form.resetFields();
      handleAdd(values);
    });
  };
  // tagScrollHandle=(e:any)=>{
  //   e.persist();
  //   const { target } = e;
  //判断滚动到底部
  //   if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
  //     this.props.dispatch({
  //       type: 'article/fetchTag',
  //     });
  //   }
  // }
  render() {
    const { modalVisible, form,  handleModalVisible, article } = this.props;
    const { getFieldDecorator } = form;
    const token=getToken();

    return (
      <Modal
        destroyOnClose
        title="新增文章"
        width={950}
        zIndex={100}
        style={{ position: 'relative' }}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem {...this.formLayout} label="标题">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入至少三个字符！', min: 3 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="描述">
          {getFieldDecorator('des', {
            rules: [{ required: true, message: '请输入3-27个字符!', min: 3 ,max: 27}],
          })(<TextArea style={{ "resize": "none" }} placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="标签">
          {getFieldDecorator('tags_id', {
            rules: [{ required: true, message: '请选择标签' }],
          })(
            <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
              {article.tag.map((v: any) => {
                return (
                  <Option key={v.id} value={v.id}>{v.name}</Option>
                )
              })}
            </Select>)}
        </FormItem>
        <FormItem {...this.formLayout} label="状态">
          {getFieldDecorator('status', { valuePropName: 'checked', initialValue: false })(<Switch />)}
        </FormItem>
        <Form.Item {...this.formLayout} label="主图">
          {getFieldDecorator('main_img', {
            // valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            rules: [{ required: true, message: '请上传图片' }]
          })(
            <Upload name="file" action={BASE_URL+"/api/v1/upload"} headers={{ 'token': token }} onChange={this.handleChange} listType="picture" fileList={this.state.fileList} >
              <Button>
                <Icon type="upload" /> 上传图片
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <FormItem {...this.formLayout} wrapperCol={{ span: 21 }} label="内容">
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '请输入至少三个字符！' }]
          })(<MarkdownEditor form={form} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);

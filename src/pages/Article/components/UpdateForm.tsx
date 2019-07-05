import { Form, Input, Modal, Switch, Upload, Button, Icon, Select } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';
import MarkdownEditor from './MarkdownEditor';

import { Dispatch } from 'redux';
import { StateType } from '../model';
import {getToken,BASE_URL} from '@/utils/utils';

const FormItem = Form.Item;

const { TextArea } = Input;
const { Option } = Select;

export interface fieldsValue {
  id:number;
  title: string;
  des: string;
  tags_id: number[];
  status: boolean;
  main_img: string;
  content: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdate: (values: fieldsValue) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  handleUpdateModalVisible: (flag?: boolean, formVals?: Partial<TableListItem>) => void;
  article: StateType;
  dispatch: Dispatch<any>;
}


export interface UpdateFormState {
  fileList:any[];
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {},
  };

  formLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      fileList:[]
    };
  }
  componentDidMount(){
    const main_img:any=this.props.values.main_img;
    const fileList=[
      {
        uid: this.props.values.id,
        name: main_img&&main_img.split('/')[main_img.split('/').length-1],
        status: 'done',
        url: BASE_URL+main_img
      }
    ]
    // console.log(fileList)
    // return;
    this.setState({
      fileList:fileList
    })
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
        file.url = BASE_URL+file.response.data.file_url;
        // file.name = file.url&&file.url.split('/')[file.url.split('/').length-1];
      }
      return file;
    });
    this.setState({fileList})
  };

  okHandle = () => {
    const {handleUpdate,form}=this.props;
    form.validateFields((err, fieldsValue:any) => {
      if (err) return;
      let img_url=fieldsValue.main_img[0].url.replace(BASE_URL,'');
      let formValues:fieldsValue={
        id:this.props.values.id,
        ...fieldsValue,
        main_img:img_url
      }
      // console.log(formValues);
      // return;
      form.resetFields();
      handleUpdate(formValues);
    });
  };
  render() {
    const { updateModalVisible, form,  handleUpdateModalVisible, article,values } = this.props;
    const { getFieldDecorator } = form;
    const token=getToken();
    const tags_id=values.tags&&values.tags.map((v:any)=>v.id);
    return (
      <Modal
        destroyOnClose
        title="编辑文章"
        width={950}
        zIndex={100}
        style={{ position: 'relative' }}
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem {...this.formLayout} label="标题">
          {getFieldDecorator('title', {
            initialValue: values.title,
            rules: [{ required: true, message: '请输入至少三个字符！', min: 3 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="描述">
          {getFieldDecorator('des', {
            initialValue: values.des,
            rules: [{ required: true, message: '请输入3-27个字符!', min: 3 ,max: 27}],
          })(<TextArea style={{ "resize": "none" }} placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="标签">
          {getFieldDecorator('tags_id', {
            initialValue: tags_id,
            rules: [{ required: true, message: '请选择标签' }],
          })(
            <Select mode="multiple"  placeholder="请选择" style={{ width: '100%' }}>
              {article.tag.map((v: any) => {
                return (
                  <Option key={v.id} value={v.id}>{v.name}</Option>
                )
              })}
            </Select>)}
        </FormItem>
        <FormItem {...this.formLayout} label="状态">
          {getFieldDecorator('status', { valuePropName: 'checked', initialValue: values.status===0?false:true})(<Switch />)}
        </FormItem>
        <Form.Item {...this.formLayout} label="主图">
          {getFieldDecorator('main_img', {
            // valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
            initialValue: this.state.fileList,
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
            initialValue: values.content,
            rules: [{ required: true, message: '请输入至少三个字符！' }]
          })(<MarkdownEditor form={form} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);

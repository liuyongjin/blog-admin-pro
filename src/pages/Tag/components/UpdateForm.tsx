import { Form, Input, Modal } from 'antd';
import React from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

const FormItem = Form.Item;

interface fieldsValue{
  id:any;
  name: string;
  des: string;
  color:string;
  bg_color:string;
}

interface CreateFormProps extends FormComponentProps {
  handleUpdate: (values: fieldsValue) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  handleUpdateModalVisible: (flag?: boolean, formVals?: TableListItem) => void;
}

const UpdateForm: React.SFC<CreateFormProps> = props => {
  const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible,values} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate({...fieldsValue as fieldsValue,id:values.id});
    });
  };

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      destroyOnClose
      title="编辑标签"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    >
      <FormItem {...formLayout} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少三个字符的名称!', min: 3 }],
          initialValue:values.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="描述">
        {form.getFieldDecorator('des', {
          rules: [{ required: true, message: '请输入至少三个字符的描述!', min: 3 }],
          initialValue:values.des
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="字体颜色">
        {form.getFieldDecorator('color', {
          rules: [{ required: true, message: '请输入字体颜色!' }],
          initialValue:values.color
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem {...formLayout} label="背景颜色">
        {form.getFieldDecorator('bg_color', {
          rules: [{ required: true, message: '请输入背景颜色!' }],
          initialValue:values.bg_color
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default UpdateForm;

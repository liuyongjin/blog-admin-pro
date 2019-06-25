import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;

interface fieldsValue{
  name: string;
  des: string;
}

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (
    fieldsValue: fieldsValue,
  ) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.SFC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue as fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建标签"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少三个字符的名称!', min: 3 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} label="描述">
        {form.getFieldDecorator('des', {
          rules: [{ required: true, message: '请输入至少三个字符的描述!', min: 3 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);

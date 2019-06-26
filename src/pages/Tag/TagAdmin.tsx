import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Menu,
  Modal,
  Row,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import UpdateForm from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import { formatDate } from '@/utils/utils';

import styles from './style.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;


const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  tag: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string[]|string };
  params: Partial<TableListParams>;
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    tag,
    loading,
  }: {
    tag: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    tag,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    params: {
      // create_date:[]
    }
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    }, {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    }, {
      title: '描述',
      dataIndex: 'des',
      align: 'center',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'create_time'
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'update_time',
      sorter: true
    },
    {
      title: '操作',
      align: 'center',
      render: (item, record) => (
        <Fragment>
          <Button className={styles.btn} type="primary" onClick={() => this.handleUpdateModalVisible(true, record)}>
            编辑
          </Button>
          <Button className={styles.btn} type="danger" onClick={() => this.handleDel(item)}>删除</Button>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.init();
  }
  init() {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'tag/fetch',
      payload: {
        ...params
      }
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    // type {sorter:string;create_time:string[]}
    const cond: any = {
      ...this.state.params
    };
    if (sorter.field) {
      cond.sorter = `${sorter.field} ${sorter.order}`;
    }else{
      delete cond.sorter;
    }
    const p={
      ...cond,
      current: pagination.current,
      pageSize: pagination.pageSize
    }
    this.setState({
      params: p
    }, () => {
      dispatch({
        type: 'tag/fetch',
        payload: this.state.params,
      });
    })
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        // create_date: []
      },
      params: {}
    });
    dispatch({
      type: 'tag/fetch',
      payload: {},
    });
  };


  handleDel(item: any) {
    const { dispatch } = this.props;
    confirm({
      title: `确定删除该标签?`,
      okText: '是的',
      // okType: 'danger',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type: 'tag/del',
          payload: {
            id: item.id
          },
          callback: () => {
            this.init();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'bdel':
        confirm({
          title: `确定删除${selectedRows.length}项标签?`,
          okText: '是的',
          cancelText: '取消',
          onOk:()=>{
            dispatch({
              type: 'tag/bdel',
              payload: {
                ids: selectedRows.map(row => row.id),
              },
              callback: () => {
                this.init();
                this.setState({
                  selectedRows:[]
                })
              }
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { form } = this.props;
    // const { params } = this.state;

    form.validateFields((err, fieldsValue: any) => {
      if (err) return;
      const values: any = {
        create_date: [
          formatDate(fieldsValue.create_date[0]),
          formatDate(fieldsValue.create_date[1])
        ]
      };

      //保存搜索数据
      this.setState({
        params: {
          ...values
        },
        formValues:{
          ...fieldsValue
        }
      },()=>{
        this.init();
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: Partial<TableListItem>) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { name: string; des: string }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/add',
      payload: {
        name: fields.name,
        des: fields.des,
      },
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.init();
      }
    });
  };

  handleUpdate = (fields: Partial<TableListItem>) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/update',
      payload: {
        name: fields.name,
        des: fields.des,
        id: fields.id,
      },
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.init();
      }
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_date', {
                initialValue: this.state.formValues.create_date,
                rules: [{ required: true, message: '请选择日期'}]
              })(
                <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                查询
            </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
            </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  render() {
    const {
      tag: { data },
      loading,
      form,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="bdel">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              // scroll={{x:true}}
              selectedRows={selectedRows}
              loading={loading}
              rowKey={item => item.id + ''}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            form={form}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);

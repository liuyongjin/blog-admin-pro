import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
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
import UpdateForm, { FormValsType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';
import { formatDate } from '@/utils/utils';

import styles from './style.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 0 | 1;
const statusMap: any[] = ['default', 'processing'];
const status = ['关闭', '显示'];
const { RangePicker } = DatePicker;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  article: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]:  string[]|string };
  stepFormValues: Partial<TableListItem>;
  params: Partial<TableListParams>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    article,
    loading,
  }: {
    article: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    article,
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
    }
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '标题',
      key: 'id',
      dataIndex: 'title',
      align: 'center',
    }, {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
    }, {
      title: '主图',
      dataIndex: 'main_img',
      align: 'center',
    }, {
      title: '点赞数',
      dataIndex: 'praise_count',
      align: 'center',
    }, {
      title: '浏览数',
      sorter: true,
      dataIndex: 'browse_count',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render(val) {
        return <Badge status={statusMap[val as IStatusMapType]} text={status[val as IStatusMapType]} />;
      },
    },
    // {
    //   title: '标签',
    //   align: 'center',
    //   dataIndex: 'tags',
    //   render(tags:any) {
    //     return (
    //       <Fragment>
    //         {tags.map(v=>{
    //           return (
    //             <Badge color="#f50" key={v.id} text={v.name} />
    //           )
    //         })}
    //     </Fragment>
    //     );
    //   },
    // },
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
    this.initTag();
  }
  init() {
    const { dispatch } = this.props;
    const { params } = this.state;
    dispatch({
      type: 'article/fetch',
      payload: {
        ...params
      }
    });
  }
  initTag(){
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetchTag',
    });
  }
  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field} ${sorter.order}`;
    }

    dispatch({
      type: 'article/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
      },
      params: {}
    });
    dispatch({
      type: 'article/fetch',
      payload: {},
    });
  };


  handleDel(item: any) {
    const { dispatch } = this.props;
    confirm({
      title: `确定删除该标签?`,
      okText: '是的',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'article/del',
          payload: {
            id: item.id,
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
          onOk: () => {
            dispatch({
              type: 'article/bdel',
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

    const {form } = this.props;

    form.validateFields((err, fieldsValue:any) => {
      if (err) return;
      const values: any = {
        ...fieldsValue,
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
        formValues: {
          ...fieldsValue
        }
      }, () => {
        this.init();
      })
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { des: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/add',
      payload: {
        des: fields.des,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/update',
      // payload: {
      //   name: fields.name,
      //   des: fields.des,
      //   key: fields.key,
      // },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };


  renderAdvancedForm() {
    const {
      article: { tag },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">显示</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标签">
              {getFieldDecorator('tags_id')(
                <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                  {tag.map((v) => {
                    return (
                      <Option key={v.id} value={v.id}>{v.name}</Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_date',{
                rules: [{ required: true, message: '请选择日期'}],
                initialValue: this.state.formValues.create_date
              })(
                <RangePicker style={{ width: '100%' }} />
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
      article: { data },
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
                新增
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

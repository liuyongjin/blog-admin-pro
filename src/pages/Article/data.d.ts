export interface TableListItem {
  browse_count: number;
  comment_count: number;
  content: string;
  create_time: string;
  description: string;
  id: number;
  main_img: string;
  praise_count: number;
  // tags: object[];
  tags: Array<object>;
  title: string;
  update_time: string;
  status: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListType {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  current: number;
}

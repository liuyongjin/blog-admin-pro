export interface TableListItem {
  // disabled?:boolean;
  id?: number;
  create_time: string;
  des: string;
  name: string;
  update_time: string;
  color:string;
  bg_color:string;
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
  create_date?:string[];
  pageSize: number;
  current: number;
  sorter: string;
}

export interface addTagParams {
  name: string;
  des: string;
}


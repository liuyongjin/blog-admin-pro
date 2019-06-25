// import request from 'umi-request';
import request from '@/utils/request';
import { TableListParams,addTagParams,TableListItem} from './data.d';

export async function queryTag(params: TableListParams) {
  return request('/tag/index', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function delTag(params: {id:number}) {
  return request('/tag/del', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function bdelTag(params:{ids:Array<number>}) {
  return request('/tag/bdel', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function addTag(params: addTagParams) {
  return request('/tag/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateTag(params: TableListItem) {
  return request('/tag/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

// import request from 'umi-request';
import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryTag(params: TableListParams) {
  return request('/tag/index', {
    params
  });
}

export async function delTag(params: TableListParams) {
  return request('/tag/del', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function bdelTag(params: TableListParams) {
  return request('/tag/bdel', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function addTag(params: TableListParams) {
  return request('/tag/bdel', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateTag(params: TableListParams) {
  return request('/tag/bdel', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

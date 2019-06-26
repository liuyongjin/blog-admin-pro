// import request from 'umi-request';
import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryArticle(params: TableListParams) {
  return request('/article/index', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function queryTag() {
  return request('/tag/index', {
    method: 'POST',
  });
}

export async function delArticle(params: TableListParams) {
  return request('/article/del', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function bdelArticle(params: TableListParams) {
  return request('/article/bdel', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function addArticle(params: TableListParams) {
  return request('/article/bdel', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateArticle(params: TableListParams) {
  return request('/article/bdel', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

// import request from 'umi-request';
import request from '@/utils/request';
import { TableListParams,TableListItem } from './data.d';

export async function queryArticle(params: TableListParams) {
  return request('/article/index', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function queryTag(params:{current:number}) {
  return request('/tag/index', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateArticleStatus(params: {id:number,status:number}) {
  return request('/article/updateStatus', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function delArticle(params: {id:number}) {
  return request('/article/del', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function bdelArticle(params: {ids:Array<number>}) {
  return request('/article/bdel', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function addArticle(params: TableListItem) {
  return request('/article/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateArticle(params: TableListItem) {
  return request('/article/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

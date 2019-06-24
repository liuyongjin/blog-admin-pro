// import request from 'umi-request';
import { FromDataType } from './Login';
import request from '@/utils/request';

export async function fakeAccountLogin(params: FromDataType) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}



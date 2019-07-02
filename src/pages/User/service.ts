// import request from 'umi-request';
import { FormDataType } from './Login';
import request from '@/utils/request';

export async function AccountLogin(params: FormDataType) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}



import request from 'umi-request';
import { CurrentUser } from '@/models/user';

// export async function queryCurrent() {
//   return request('/currentUser');
// }

export async function modifyInfo(params: CurrentUser){
  return request('/modifyInfo', {
    method: 'POST',
    data: {
      ...params
    }
  });
}
export async function modifyAvatar(params: {avatar:string}){
  return request('/modifyAvatar', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

